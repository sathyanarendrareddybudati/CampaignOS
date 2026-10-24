from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from app.domain import schemas
from app.application import services
from app.infrastructure.database import get_db

router = APIRouter()

TOUCHPOINT_TEMPLATES = [
    {
        "id": "pos_screen",
        "name": "POS Countertop Screen (16:9)",
        "resolution": "1920x1080",
        "category": "In-Store POS",
        "description": "High-impact visual display for customer checkout screen with dynamic QR code.",
        "default_theme": "luxury_gold",
        "default_title": "Summer Sparkle: 20% Off Your Purchase",
        "default_subtitle": "Scan the QR code below at checkout to unlock your exclusive store reward.",
        "default_cta": "Scan to Claim",
        "aspect_ratio": "16:9"
    },
    {
        "id": "story_9_16",
        "name": "Social Story Ad (9:16)",
        "resolution": "1080x1920",
        "category": "Digital Advertising",
        "description": "Vertical full-screen visual tailored for Instagram Stories and TikTok ads.",
        "default_theme": "vibrant_neon",
        "default_title": "VIP Flash Sale This Weekend",
        "default_subtitle": "Show this voucher code at any Paris boutique location.",
        "default_cta": "Tap to Save",
        "aspect_ratio": "9:16"
    },
    {
        "id": "mobile_push",
        "name": "Rich Push Notification Banner",
        "resolution": "800x400",
        "category": "Mobile Messaging",
        "description": "Compact rich media banner displayed inside iOS and Android notification drawers.",
        "default_theme": "deep_emerald",
        "default_title": "You earned a free Spin & Win!",
        "default_subtitle": "Your reward is waiting for you in-store today.",
        "default_cta": "Spin Now",
        "aspect_ratio": "2:1"
    },
    {
        "id": "coupon_receipt",
        "name": "Digital Receipt Voucher",
        "resolution": "600x800",
        "category": "Print / Digital POS",
        "description": "Clean coupon card formatted for digital receipts and thermal POS printers.",
        "default_theme": "minimal_slate",
        "default_title": "Thank You for Visiting Maison Lune",
        "default_subtitle": "Enjoy €10 off your next purchase above €50.",
        "default_cta": "Valid until end of month",
        "aspect_ratio": "3:4"
    }
]

@router.get("/templates/touchpoints")
def list_touchpoint_templates():
    return TOUCHPOINT_TEMPLATES

@router.post("/", response_model=schemas.PromoBannerResponse)
def create_promo_banner(banner: schemas.PromoBannerCreate, db: Session = Depends(get_db)):
    return services.create_banner(db, banner)

@router.get("/", response_model=List[schemas.PromoBannerResponse])
def list_promo_banners(campaign_id: Optional[str] = None, db: Session = Depends(get_db)):
    return services.get_banners(db, campaign_id=campaign_id)

@router.get("/{id}")
def get_promo_banner(id: str, db: Session = Depends(get_db)):
    banner = services.get_banner(db, id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    # Ready-to-render embed payload
    touchpoint_info = next((t for t in TOUCHPOINT_TEMPLATES if t["id"] == banner.touchpoint), TOUCHPOINT_TEMPLATES[0])
    
    return {
        "id": banner.id,
        "campaign_id": banner.campaign_id,
        "title": banner.title,
        "subtitle": banner.subtitle,
        "touchpoint": banner.touchpoint,
        "touchpoint_info": touchpoint_info,
        "theme": banner.theme,
        "discount_code": banner.discount_code,
        "cta_text": banner.cta_text,
        "bg_gradient": banner.bg_gradient,
        "qr_url": banner.qr_url or f"https://loyum.io/claim/{banner.id}",
        "created_at": banner.created_at,
        "embed_html": f'<div class="loyum-promo-touchpoint" data-banner-id="{banner.id}"><h3>{banner.title}</h3><p>{banner.subtitle or ""}</p><span class="badge">{banner.discount_code or "PROMO"}</span></div>'
    }

@router.delete("/{id}")
def delete_promo_banner(id: str, db: Session = Depends(get_db)):
    banner = services.delete_banner(db, id)
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    return {"message": "Banner deleted successfully"}
