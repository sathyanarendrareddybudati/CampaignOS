from sqlalchemy import Column, String, Float, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

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
