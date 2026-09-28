from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.domain import schemas
from app.application import services
from app.infrastructure.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.CampaignResponse)
def create_campaign(campaign: schemas.CampaignCreate, db: Session = Depends(get_db)):
    return services.create_campaign(db, campaign)

@router.get("/", response_model=List[schemas.CampaignResponse])
def list_campaigns(db: Session = Depends(get_db)):
    return services.get_campaigns(db)

@router.get("/{id}", response_model=schemas.CampaignResponse)
def get_campaign(id: str, db: Session = Depends(get_db)):
    db_campaign = services.get_campaign(db, id)
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

@router.patch("/{id}", response_model=schemas.CampaignResponse)
def update_campaign(id: str, updates: schemas.CampaignUpdate, db: Session = Depends(get_db)):
    try:
        db_campaign = services.update_campaign(db, id, updates)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return db_campaign

@router.post("/{id}/activate")
def activate_campaign(id: str, db: Session = Depends(get_db)):
    db_campaign = services.get_campaign(db, id)
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    if db_campaign.status not in ["Draft", "Paused"]:
        raise HTTPException(status_code=400, detail="Cannot activate this campaign")
    
    services.set_campaign_status(db, id, "Active")
    return {"message": "Campaign activated"}

@router.post("/{id}/pause")
def pause_campaign(id: str, db: Session = Depends(get_db)):
    db_campaign = services.get_campaign(db, id)
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    if db_campaign.status != "Active":
        raise HTTPException(status_code=400, detail="Only active campaigns can be paused")
    
    services.set_campaign_status(db, id, "Paused")
    return {"message": "Campaign paused"}

@router.get("/{id}/analytics")
def get_campaign_analytics(id: str, db: Session = Depends(get_db)):
    db_campaign = services.get_campaign(db, id)
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    # Mock data for PoC
    return {
        "campaign_id": id,
        "impressions": 1500,
        "play_rate": 0.45,
        "conversion_rate": 0.12,
        "rewards_redeemed": 35
    }
