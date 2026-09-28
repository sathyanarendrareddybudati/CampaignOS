from fastapi import FastAPI
from app.api.v1.endpoints import campaigns, rules, games
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.database import engine
from app.domain import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Merchant Marketing & Campaign Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"])
app.include_router(rules.router, prefix="/api/v1/campaigns", tags=["rules"])
app.include_router(games.router, prefix="/api/v1", tags=["games"])
app.include_router(games.router_templates, prefix="/api/v1/gametemplates", tags=["gametemplates"])

@app.get("/")
def root():
    return {"message": "Merchant Marketing & Campaign Engine API is running"}
