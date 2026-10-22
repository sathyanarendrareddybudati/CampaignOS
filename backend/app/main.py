import asyncio
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import campaigns, rules, games, users, events, overview, analytics, settings, banners
from app.infrastructure.database import engine
from app.domain import models
from app.api import deps
from app.infrastructure.kafka_consumer import consume_events

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Merchant Marketing & Campaign Engine", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(consume_events())


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"], dependencies=[Depends(deps.get_current_user)])
app.include_router(rules.router, prefix="/api/v1/campaigns", tags=["rules"], dependencies=[Depends(deps.get_current_user)])
app.include_router(games.router, prefix="/api/v1", tags=["games"], dependencies=[Depends(deps.get_current_user)])
app.include_router(games.router_templates, prefix="/api/v1/gametemplates", tags=["gametemplates"], dependencies=[Depends(deps.get_current_user)])
app.include_router(banners.router, prefix="/api/v1/banners", tags=["banners"], dependencies=[Depends(deps.get_current_user)])
app.include_router(events.router, prefix="/api/v1/events", tags=["events"], dependencies=[Depends(deps.get_current_user)])
app.include_router(overview.router, prefix="/api/v1/overview", tags=["overview"], dependencies=[Depends(deps.get_current_user)])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"], dependencies=[Depends(deps.get_current_user)])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["settings"], dependencies=[Depends(deps.get_current_user)])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
def root():
    return {"message": "Merchant Marketing & Campaign Engine API is running"}
