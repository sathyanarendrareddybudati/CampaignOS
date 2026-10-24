from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.domain import models, schemas
from app.api import deps
from app.infrastructure.database import get_db

router = APIRouter()

@router.get("/", response_model=schemas.MerchantSettingResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    settings = db.query(models.MerchantSetting).filter(models.MerchantSetting.user_id == current_user.id).first()
    if not settings:
        settings = models.MerchantSetting(
            user_id=current_user.id,
            store_name="Maison Lune - Paris",
            currency="EUR (€)",
            timezone="Europe/Paris",
            default_budget_cap=1000.0,
            default_reward_cap=500,
            auto_pause_on_budget="true",
            push_enabled="true",
            sms_enabled="true",
            email_notifications="true",
            webhook_url="http://localhost:8000/api/v1/events/",
            api_key="ml_live_sk_8f93b29c118e74a0"
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/", response_model=schemas.MerchantSettingResponse)
def update_settings(
    updates: schemas.MerchantSettingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    settings = db.query(models.MerchantSetting).filter(models.MerchantSetting.user_id == current_user.id).first()
    if not settings:
        settings = models.MerchantSetting(user_id=current_user.id)
        db.add(settings)

    update_dict = updates.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)
    return settings
