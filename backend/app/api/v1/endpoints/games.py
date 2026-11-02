from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.domain import schemas, models
from app.application import services
from app.infrastructure.database import get_db

router = APIRouter()
router_templates = APIRouter()

TEMPLATES = [
    {
        "id": "spin-the-wheel",
        "name": "Fortune Spin Wheel",
        "category": "High engagement",
        "description": "Engage retail shoppers with an instant prize wheel. Perfect for in-store checkout and post-purchase apps.",
        "icon": "circle",
        "badge": "Popular",
        "estimated_lift": "+34% engagement"
    },
    {
        "id": "scratch-card",
        "name": "VIP Scratch & Win",
        "category": "Retail exclusive",
        "description": "Virtual gold scratch card with instant mystery discount codes and gift reveals.",
        "icon": "card",
        "badge": "High ROI",
        "estimated_lift": "+28% conversion"
    },
    {
        "id": "mystery-gift-box",
        "name": "Mystery Box Reveal",
        "category": "Surprise & delight",
        "description": "Unbox an animated luxury loyalty gift parcel containing tier points or vouchers.",
        "icon": "gift",
        "badge": "New",
        "estimated_lift": "+41% repeat visits"
    },
    {
        "id": "loyalty-stamp-card",
        "name": "Digital Stamp Pass",
        "category": "Frequency booster",
        "description": "Collect stamps with each visit. Unlock prestigious tier badges and complimentary delights.",
        "icon": "award",
        "badge": "Loyum Signature",
        "estimated_lift": "+52% retention"
    }
]

@router_templates.get("/", response_model=List[Dict[str, Any]])
def list_game_templates():
    return TEMPLATES

@router.post("/campaigns/{campaign_id}/game", response_model=schemas.GameResponse)
def configure_game(campaign_id: str, config: schemas.GameCreate, db: Session = Depends(get_db)):
    campaign = services.get_campaign(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return services.configure_game(db, campaign_id, config)

@router.get("/campaigns/{campaign_id}/game")
def get_campaign_games(campaign_id: str, db: Session = Depends(get_db)):
    return db.query(models.Game).filter(models.Game.campaign_id == campaign_id).all()

@router.get("/games")
def list_all_games(db: Session = Depends(get_db)):
    return services.get_all_games(db)

@router.post("/games/{game_id}/play")
def play_game(game_id: str, db: Session = Depends(get_db)):
    result, err = services.play_game(db, game_id)
    if err:
        raise HTTPException(status_code=404, detail=err)
    return result

@router.get("/rewards/{reward_id}")
def get_reward(reward_id: str, db: Session = Depends(get_db)):
    reward = services.get_reward(db, reward_id)
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    return {
        "id": reward.id,
        "game_id": reward.game_id,
        "prize": reward.prize,
        "status": reward.status
    }

@router.post("/rewards/{reward_id}/redeem")
def redeem_reward(reward_id: str, db: Session = Depends(get_db)):
    reward, err = services.redeem_reward(db, reward_id)
    if err:
        raise HTTPException(status_code=400, detail=err)
    return {
        "message": "Reward redeemed successfully",
        "status": reward.status,
        "reward_id": reward.id
    }
