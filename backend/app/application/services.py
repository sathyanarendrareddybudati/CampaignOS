from sqlalchemy.orm import Session
from app.domain import models, schemas
import random

def create_campaign(db: Session, campaign: schemas.CampaignCreate):
    db_campaign = models.Campaign(**campaign.model_dump())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def get_campaign(db: Session, campaign_id: str):
    return db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()

def get_campaigns(db: Session):
    return db.query(models.Campaign).all()

def update_campaign(db: Session, campaign_id: str, updates: schemas.CampaignUpdate):
    db_campaign = get_campaign(db, campaign_id)
    if not db_campaign:
        return None
    if db_campaign.status not in ["Draft", "Paused"]:
        raise ValueError("Can only update Draft or Paused campaigns")
    
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_campaign, key, value)
        
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def set_campaign_status(db: Session, campaign_id: str, status: str):
    db_campaign = get_campaign(db, campaign_id)
    if not db_campaign:
        return None
    db_campaign.status = status
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def create_rule(db: Session, campaign_id: str, rule: schemas.RuleCreate):
    db_rule = models.Rule(campaign_id=campaign_id, **rule.model_dump())
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule

def get_rules_for_campaign(db: Session, campaign_id: str):
    return db.query(models.Rule).filter(models.Rule.campaign_id == campaign_id).all()

def get_all_rules(db: Session):
    return db.query(models.Rule).all()

def get_all_games(db: Session):
    return db.query(models.Game).all()

def delete_rule(db: Session, rule_id: str):
    db_rule = db.query(models.Rule).filter(models.Rule.id == rule_id).first()
    if db_rule:
        db.delete(db_rule)
        db.commit()
    return db_rule

def configure_game(db: Session, campaign_id: str, config: schemas.GameCreate):
    db_game = models.Game(campaign_id=campaign_id, **config.model_dump())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

def play_game(db: Session, game_id: str):
    db_game = db.query(models.Game).filter(models.Game.id == game_id).first()
    if not db_game:
        return None, "Game not found"

    # Enforce campaign reward cap if configured
    if db_game.campaign_id:
        campaign = db.query(models.Campaign).filter(models.Campaign.id == db_game.campaign_id).first()
        if campaign and campaign.reward_cap:
            issued_rewards_count = db.query(models.Reward).join(models.Game).filter(models.Game.campaign_id == campaign.id).count()
            if issued_rewards_count >= campaign.reward_cap:
                return {
                    "result": "loss",
                    "prize": None,
                    "reason": "Campaign reward cap reached",
                    "cap_reached": True,
                    "issued_count": issued_rewards_count,
                    "cap": campaign.reward_cap
                }, None
        
    won = random.random() < (db_game.odds or 0.5)
    if won and db_game.prizes:
        prize = random.choice(db_game.prizes)
        db_reward = models.Reward(game_id=game_id, prize=prize, status="Issued")
        db.add(db_reward)
        db.commit()
        db.refresh(db_reward)
        return {"result": "win", "prize": prize, "reward_id": db_reward.id}, None
        
    return {"result": "loss", "prize": None}, None

def get_reward(db: Session, reward_id: str):
    return db.query(models.Reward).filter(models.Reward.id == reward_id).first()

def redeem_reward(db: Session, reward_id: str):
    db_reward = get_reward(db, reward_id)
    if not db_reward:
        return None, "Reward not found"
    if db_reward.status == "Redeemed":
        return None, "Reward already redeemed"
        
    db_reward.status = "Redeemed"
    db.commit()
    db.refresh(db_reward)
    return db_reward, None

def create_banner(db: Session, banner: schemas.PromoBannerCreate):
    from datetime import datetime
    db_banner = models.PromoBanner(
        **banner.model_dump(),
        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    )
    db.add(db_banner)
    db.commit()
    db.refresh(db_banner)
    return db_banner

def get_banners(db: Session, campaign_id: str = None):
    query = db.query(models.PromoBanner)
    if campaign_id:
        query = query.filter(models.PromoBanner.campaign_id == campaign_id)
    return query.order_by(models.PromoBanner.id.desc()).all()

def get_banner(db: Session, banner_id: str):
    return db.query(models.PromoBanner).filter(models.PromoBanner.id == banner_id).first()

def delete_banner(db: Session, banner_id: str):
    db_banner = get_banner(db, banner_id)
    if db_banner:
        db.delete(db_banner)
        db.commit()
    return db_banner

