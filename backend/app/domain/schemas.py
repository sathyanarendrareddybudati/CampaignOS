from pydantic import BaseModel
from typing import Optional

class CampaignBase(BaseModel):
    name: str
    targeting_criteria: Optional[dict] = None
    schedule: Optional[dict] = None
    budget_cap: Optional[float] = None
    reward_cap: Optional[int] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    targeting_criteria: Optional[dict] = None
    schedule: Optional[dict] = None
    budget_cap: Optional[float] = None
    reward_cap: Optional[int] = None

class CampaignResponse(CampaignBase):
    id: str
    status: str
    class Config:
        from_attributes = True

class RuleBase(BaseModel):
    trigger: Optional[dict] = None
    action: Optional[dict] = None

class RuleCreate(RuleBase):
    pass

class RuleResponse(RuleBase):
    id: str
    campaign_id: str
    class Config:
        from_attributes = True

class GameBase(BaseModel):
    template: Optional[str] = None
    odds: Optional[float] = None
    prizes: Optional[list[str]] = None

class GameCreate(GameBase):
    pass

class GameResponse(GameBase):
    id: str
    campaign_id: str
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class EventLogResponse(BaseModel):
    id: str
    time: Optional[str] = None
    event: Optional[str] = None
    rule: Optional[str] = None
    dispatch: Optional[str] = None
    status: Optional[str] = None
    css_class: Optional[str] = None
    class Config:
        from_attributes = True

class MerchantSettingBase(BaseModel):
    store_name: Optional[str] = "Maison Lune - Paris"
    currency: Optional[str] = "EUR (€)"
    timezone: Optional[str] = "Europe/Paris"
    default_budget_cap: Optional[float] = 1000.0
    default_reward_cap: Optional[int] = 500
    auto_pause_on_budget: Optional[str] = "true"
    push_enabled: Optional[str] = "true"
    sms_enabled: Optional[str] = "true"
    email_notifications: Optional[str] = "true"
    webhook_url: Optional[str] = "http://localhost:8000/api/v1/events/"
    api_key: Optional[str] = "ml_live_sk_8f93b29c118e74a0"

class MerchantSettingUpdate(MerchantSettingBase):
    pass

class MerchantSettingResponse(MerchantSettingBase):
    id: str
    user_id: str
    class Config:
        from_attributes = True

class PromoBannerBase(BaseModel):
    campaign_id: Optional[str] = None
    title: str
    subtitle: Optional[str] = None
    touchpoint: Optional[str] = "pos_screen"
    theme: Optional[str] = "luxury_gold"
    discount_code: Optional[str] = None
    cta_text: Optional[str] = "Claim Offer"
    bg_gradient: Optional[str] = None
    qr_url: Optional[str] = None

class PromoBannerCreate(PromoBannerBase):
    pass

class PromoBannerResponse(PromoBannerBase):
    id: str
    created_at: Optional[str] = None
    class Config:
        from_attributes = True

