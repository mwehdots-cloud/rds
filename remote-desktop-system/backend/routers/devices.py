from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Device
from ..main import get_current_user

router = APIRouter()

@router.get("/devices")
async def get_devices(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    devices = db.query(Device).all()
    return devices

@router.post("/devices/{device_id}/approve")
async def approve_device(device_id: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.is_approved = True
    db.commit()
    return {"message": "Device approved"}

@router.delete("/devices/{device_id}")
async def delete_device(device_id: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"message": "Device deleted"}
