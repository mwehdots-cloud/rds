from fastapi import FastAPI, WebSocket, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from .database import get_db, engine, Base
from .models import User, Device, InteractionEvent
from .routers import auth, devices, events
import json

load_dotenv()

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(devices.router, prefix="/api")
app.include_router(events.router, prefix="/api")

# WebSocket connections
connected_devices = {}
connected_admins = set()

@app.websocket("/ws/device/{device_id}")
async def device_websocket(websocket: WebSocket, device_id: str, api_key: str = None):
    await websocket.accept()
    # Authenticate device with api_key
    db = next(get_db())
    device = db.query(Device).filter(Device.device_id == device_id, Device.api_key == api_key).first()
    if not device:
        await websocket.close(code=1008)
        return
    connected_devices[device_id] = websocket
    device.is_online = True
    device.last_active = datetime.utcnow()
    db.commit()
    try:
        while True:
            data = await websocket.receive_text()
            event = json.loads(data)
            # Store event
            interaction_event = InteractionEvent(
                device_id=device_id,
                app=event.get("package_name"),
                type=event.get("event_type"),
                text=event.get("text"),
                view_id=event.get("view_id"),
                l=event.get("bounds", {}).get("l"),
                t=event.get("bounds", {}).get("t"),
                r=event.get("bounds", {}).get("r"),
                b=event.get("bounds", {}).get("b")
            )
            db.add(interaction_event)
            db.commit()
            # Broadcast to admins
            for admin_ws in connected_admins:
                await admin_ws.send_text(json.dumps(event))
    except Exception as e:
        print(f"Device {device_id} disconnected: {e}")
    finally:
        device.is_online = False
        db.commit()
        del connected_devices[device_id]

@app.websocket("/ws/admin")
async def admin_websocket(websocket: WebSocket, token: str = None):
    # Authenticate admin with token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
    except JWTError:
        await websocket.close(code=1008)
        return
    await websocket.accept()
    connected_admins.add(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep alive
    except:
        pass
    finally:
        connected_admins.remove(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
