from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db

router = APIRouter()

@router.get("/")
def get_analytics(db: Session = Depends(get_db)):
    return {
        "impressions": "18,420",
        "impressions_trend": "+22%",
        "engagements": "4,268",
        "engagements_rate": "23.2%",
        "conversions": "1,284",
        "conversions_rate": "7.4%",
        "revenue": "€18,420",
        "revenue_trend": "+18.4%",
        "logs": [
            { "timestamp": "Jun 18 14:32", "trigger": "Purchase above €50", "channel": "Push", "status": "Converted", "value": "€24" },
            { "timestamp": "Jun 18 13:08", "trigger": "30 days inactive", "channel": "SMS", "status": "Delivered", "value": "—", "class": "gray" },
            { "timestamp": "Jun 17 19:44", "trigger": "Purchase above €50", "channel": "Push", "status": "Opened", "value": "—", "class": "gray" },
            { "timestamp": "Jun 17 18:01", "trigger": "Purchase above €50", "channel": "Ad", "status": "Converted", "value": "€42" }
        ]
    }
