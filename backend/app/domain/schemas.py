from pydantic import BaseModel
from typing import Optional

class CampaignBase(BaseModel):
    name: str
    targeting_criteria: dict
    schedule: dict
    budget_cap: float
    reward_cap: int

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
    trigger: dict
    action: dict

class RuleCreate(RuleBase):
    pass

class RuleResponse(RuleBase):
    id: str
    campaign_id: str
    class Config:
        from_attributes = True

class GameBase(BaseModel):
    template: str
    odds: float
    prizes: list[str]

class GameCreate(GameBase):
    pass

class GameResponse(GameBase):
    id: str
    campaign_id: str
    class Config:
        from_attributes = True
