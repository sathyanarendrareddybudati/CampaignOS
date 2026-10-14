from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db

router = APIRouter()

@router.get("/")
def get_overview(db: Session = Depends(get_db)):
    return {
        "active_campaigns": 6,
        "audience_reached": "24,860",
        "conversions": "1,284",
        "rewards_issued": "€3,940",
        "recent_activity": [
            { "event": "Purchase threshold matched", "channel": "Push", "status": "Delivered", "timestamp": "2 min ago" },
            { "event": "Spin & save reward issued", "channel": "Game", "status": "Converted", "timestamp": "8 min ago" },
            { "event": "Inactive customer re-engaged", "channel": "SMS", "status": "Delivered", "timestamp": "14 min ago" }
        ],
        "campaign_health": [
            { "name": "Weekend comeback", "desc": "82% budget used", "status": "Active" },
            { "name": "Spin & save", "desc": "61% rewards used", "status": "Active" },
            { "name": "Summer launch", "desc": "Starts Jun 24", "status": "Scheduled" }
        ]
    }
