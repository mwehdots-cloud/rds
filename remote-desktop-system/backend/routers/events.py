from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import InteractionEvent
from ..main import get_current_user
from typing import Optional
from datetime import datetime

router = APIRouter()

@router.get("/events")
async def get_events(
    device_id: Optional[str] = Query(None),
    app: Optional[str] = Query(None),
    event_type: Optional[str] = Query(None),
    start_time: Optional[datetime] = Query(None),
    end_time: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    query = db.query(InteractionEvent)
    if device_id:
        query = query.filter(InteractionEvent.device_id == device_id)
    if app:
        query = query.filter(InteractionEvent.app == app)
    if event_type:
        query = query.filter(InteractionEvent.type == event_type)
    if start_time:
        query = query.filter(InteractionEvent.ts >= start_time)
    if end_time:
        query = query.filter(InteractionEvent.ts <= end_time)
    events = query.all()
    return events
