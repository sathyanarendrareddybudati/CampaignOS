from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.infrastructure.database import get_db
from app.domain import models, schemas
from typing import List

router = APIRouter()

@router.get("/", response_model=List[schemas.EventLogResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.EventLog).order_by(models.EventLog.created_at.desc()).limit(50).all()
    if not events:
        return [
            { "id": "1", "time": "14:32:06", "event": "customer.purchase.recorded", "rule": "Purchase threshold matched", "dispatch": "Push sent", "status": "Delivered", "css_class": "purple" },
            { "id": "2", "time": "14:32:05", "event": "campaign.dispatch.command", "rule": "Weekend comeback", "dispatch": "Push adapter", "status": "Delivered", "css_class": "blue" }
        ]
    return events

@router.get("/logs", response_model=List[schemas.EventLogResponse])
def get_event_logs(db: Session = Depends(get_db)):
    return db.query(models.EventLog).order_by(models.EventLog.created_at.desc()).limit(100).all()

@router.post("/")
@router.post("/webhook")
def ingest_event(payload: dict, db: Session = Depends(get_db)):
    event_type = payload.get("event") or payload.get("type", "unknown.event")
    email = payload.get("email", "customer@example.com")
    amount = float(payload.get("amount", 0.0) or 0.0)
    customer_id = payload.get("customer_id", "anonymous")

    time_str = datetime.utcnow().strftime("%H:%M:%S")

    # 1. Evaluate active rules
    rules = db.query(models.Rule).all()
    matched_actions = []
    first_match = None
    
    for r in rules:
        trigger = r.trigger if isinstance(r.trigger, dict) else {}
        action = r.action if isinstance(r.action, dict) else {}
        trig_event = trigger.get("event")
        threshold = float(trigger.get("threshold", 0) or 0)

        # Match logic
        is_match = False
        if trig_event == event_type:
            if "purchase" in event_type and threshold > 0:
                if amount >= threshold:
                    is_match = True
            else:
                is_match = True
        
        if is_match:
            action_type = action.get("type", "Push")
            dispatch_name = f"{action_type} adapter"
            
            # Send real email if action is email-related and valid recipient provided
            if email and email != "customer@example.com" and "email" in action_type.lower():
                from app.infrastructure.kafka_consumer import send_email
                send_email(email, action_type)

            matched_actions.append(action_type)
            if not first_match:
                first_match = {
                    "rule": f"Matched: {trig_event}",
                    "dispatch": dispatch_name,
                    "status": "Delivered",
                    "css_class": "purple" if "game" in action_type.lower() else "blue"
                }

    # 2. Record single authoritative log entry
    if first_match:
        event_log = models.EventLog(
            time=time_str,
            event=event_type,
            rule=first_match["rule"],
            dispatch=first_match["dispatch"],
            status=first_match["status"],
            css_class=first_match["css_class"]
        )
    else:
        event_log = models.EventLog(
            time=time_str,
            event=event_type,
            rule="No matching rule",
            dispatch="—",
            status="Ignored",
            css_class="yellow"
        )
    
    db.add(event_log)
    db.commit()

    return {
        "status": "Event processed",
        "event": event_type,
        "customer_id": customer_id,
        "matched_rules_count": len(matched_actions),
        "dispatched_actions": matched_actions
    }
