import asyncio
import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.database import engine
from app.domain import models
from app.api import deps
from app.api.v1.endpoints import users
from app.infrastructure.kafka_consumer import consume_events

logger = logging.getLogger(__name__)

try:
    models.Base.metadata.create_all(bind=engine)
except Exception as e:
    logger.warning(f"Database connection warning on startup: {e}")

app = FastAPI(title="Merchant Marketing & Campaign Engine (Core Base)", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    try:
        asyncio.create_task(consume_events())
    except Exception as e:
        logger.warning(f"Kafka consumer startup warning: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Authentication & User Management router (Common)
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

# rahul's endpoints: Campaigns & Rules
try:
    from app.api.v1.endpoints import campaigns, rules
    if hasattr(campaigns, "router"):
        app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"], dependencies=[Depends(deps.get_current_user)])
    if hasattr(rules, "router"):
        app.include_router(rules.router, prefix="/api/v1/campaigns", tags=["rules"], dependencies=[Depends(deps.get_current_user)])
except Exception:
    pass

# satya's endpoints: Games, Events, Overview, Analytics
try:
    from app.api.v1.endpoints import games, events, overview, analytics
    if hasattr(games, "router"):
        app.include_router(games.router, prefix="/api/v1", tags=["games"], dependencies=[Depends(deps.get_current_user)])
    if hasattr(games, "router_templates"):
        app.include_router(games.router_templates, prefix="/api/v1/gametemplates", tags=["gametemplates"], dependencies=[Depends(deps.get_current_user)])
    if hasattr(events, "router"):
        app.include_router(events.router, prefix="/api/v1/events", tags=["events"], dependencies=[Depends(deps.get_current_user)])
    if hasattr(overview, "router"):
        app.include_router(overview.router, prefix="/api/v1/overview", tags=["overview"], dependencies=[Depends(deps.get_current_user)])
    if hasattr(analytics, "router"):
        app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"], dependencies=[Depends(deps.get_current_user)])
except Exception:
    pass

@app.get("/")
def root():
    return {"message": "Merchant Marketing & Campaign Engine Core API is running"}
