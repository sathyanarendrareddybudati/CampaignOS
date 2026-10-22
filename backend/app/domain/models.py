from sqlalchemy import Column, String, Float, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.infrastructure.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, index=True)
    status = Column(String, default="Draft")
    targeting_criteria = Column(JSON)
    schedule = Column(JSON)
    budget_cap = Column(Float)
    reward_cap = Column(Integer)

    rules = relationship("Rule", back_populates="campaign")
    games = relationship("Game", back_populates="campaign")

class Rule(Base):
    __tablename__ = "rules"
    id = Column(String, primary_key=True, default=generate_uuid)
    campaign_id = Column(String, ForeignKey("campaigns.id"))
    trigger = Column(JSON)
    action = Column(JSON)

    campaign = relationship("Campaign", back_populates="rules")

class Game(Base):
    __tablename__ = "games"
    id = Column(String, primary_key=True, default=generate_uuid)
    campaign_id = Column(String, ForeignKey("campaigns.id"))
    template = Column(String)
    odds = Column(Float)
    prizes = Column(JSON)

    campaign = relationship("Campaign", back_populates="games")

class Reward(Base):
    __tablename__ = "rewards"
    id = Column(String, primary_key=True, default=generate_uuid)
    game_id = Column(String, ForeignKey("games.id"))
    prize = Column(String)
    status = Column(String, default="Issued")

class EventLog(Base):
    __tablename__ = "event_logs"
    id = Column(String, primary_key=True, default=generate_uuid)
    time = Column(String)
    event = Column(String)
    rule = Column(String)
    dispatch = Column(String)
    status = Column(String)
    css_class = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class MerchantSetting(Base):
    __tablename__ = "merchant_settings"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, unique=True, index=True)
    store_name = Column(String, default="Maison Lune - Paris")
    currency = Column(String, default="EUR (€)")
    timezone = Column(String, default="Europe/Paris")
    default_budget_cap = Column(Float, default=1000.0)
    default_reward_cap = Column(Integer, default=500)
    auto_pause_on_budget = Column(String, default="true")
    push_enabled = Column(String, default="true")
    sms_enabled = Column(String, default="true")
    email_notifications = Column(String, default="true")
    webhook_url = Column(String, default="http://localhost:8000/api/v1/events/")
    api_key = Column(String, default="ml_live_sk_8f93b29c118e74a0")

class PromoBanner(Base):
    __tablename__ = "promo_banners"
    id = Column(String, primary_key=True, default=generate_uuid)
    campaign_id = Column(String, ForeignKey("campaigns.id"), nullable=True)
    title = Column(String)
    subtitle = Column(String, nullable=True)
    touchpoint = Column(String, default="pos_screen")
    theme = Column(String, default="luxury_gold")
    discount_code = Column(String, nullable=True)
    cta_text = Column(String, default="Claim Offer")
    bg_gradient = Column(String, nullable=True)
    qr_url = Column(String, nullable=True)
    created_at = Column(String, nullable=True)

    campaign = relationship("Campaign", back_populates="banners")

Campaign.banners = relationship("PromoBanner", back_populates="campaign")

