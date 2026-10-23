from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.domain import schemas
from app.application import services
from app.infrastructure.database import get_db

router = APIRouter()

@router.post("/{id}/rules", response_model=schemas.RuleResponse)
def create_rule(id: str, rule: schemas.RuleCreate, db: Session = Depends(get_db)):
    return services.create_rule(db, id, rule)

@router.get("/rules/all", response_model=List[schemas.RuleResponse])
def list_all_rules(db: Session = Depends(get_db)):
    return services.get_all_rules(db)

@router.get("/{id}/rules", response_model=List[schemas.RuleResponse])
def list_rules(id: str, db: Session = Depends(get_db)):
    return services.get_rules_for_campaign(db, id)

@router.delete("/rules/{rule_id}")
def delete_rule(rule_id: str, db: Session = Depends(get_db)):
    db_rule = services.delete_rule(db, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return {"message": "Rule deleted"}