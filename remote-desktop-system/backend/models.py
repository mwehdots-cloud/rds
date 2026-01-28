from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="viewer")  # admin, operator, viewer
    is_active = Column(Boolean, default=True)

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True)
    name = Column(String)
    os = Column(String)
    ip = Column(String)
    last_active = Column(DateTime, default=datetime.utcnow)
    is_online = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    api_key = Column(String, unique=True)

class InteractionEvent(Base):
    __tablename__ = "interaction_events"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, ForeignKey("devices.device_id"))
    ts = Column(DateTime, default=datetime.utcnow)
    app = Column(String)  # package_name
    type = Column(String)  # event_type
    text = Column(Text)
    view_id = Column(String)
    l = Column(Float)  # left bound
    t = Column(Float)  # top bound
    r = Column(Float)  # right bound
    b = Column(Float)  # bottom bound

    device = relationship("Device")
