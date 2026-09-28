from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.domain import schemas
from app.application import services
from app.infrastructure.database import get_db

router = APIRouter()
router_templates = APIRouter()

@router_templates.get("/")
def list_game_templates():
    return [
        {"id": "spin-the-wheel", "name": "Spin the Wheel", "description": "A classic wheel of fortune."},
        {"id": "scratch-card", "name": "Scratch Card", "description": "Digital scratch card experience."},
        {"id": "quiz", "name": "Quiz", "description": "Answer to win."}
    ]

@router.post("/campaigns/{id}/game", response_model=schemas.GameResponse)
def configure_game(id: str, config: schemas.GameCreate, db: Session = Depends(get_db)):
    return services.configure_game(db, id, config)

@router.post("/games/{id}/play")
def play_game(id: str, db: Session = Depends(get_db)):
    result, error = services.play_game(db, id)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return result

@router.get("/rewards/{id}")
def check_reward(id: str, db: Session = Depends(get_db)):
    reward = services.get_reward(db, id)
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    return {"id": reward.id, "game_id": reward.game_id, "prize": reward.prize, "status": reward.status}

@router.post("/rewards/{id}/redeem")
def redeem_reward(id: str, db: Session = Depends(get_db)):
    reward, error = services.redeem_reward(db, id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return {"message": "Reward redeemed successfully"}
