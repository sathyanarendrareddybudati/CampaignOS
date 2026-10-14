from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.domain import models, schemas
from typing import List

router = APIRouter()

@router.get("/", response_model=List[schemas.EventLogResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.EventLog).order_by(models.EventLog.time.desc()).limit(50).all()
    if not events:
        # Return mock data if empty just so UI has something while waiting for kafka
        return [
            { "id": "1", "time": "14:32:06", "event": "customer.purchase.recorded", "rule": "Purchase threshold matched", "dispatch": "Push sent", "status": "Delivered", "css_class": "purple" },
            { "id": "2", "time": "14:32:05", "event": "campaign.dispatch.command", "rule": "Weekend comeback", "dispatch": "Push adapter", "status": "Delivered", "css_class": "blue" }
        ]
    return events
