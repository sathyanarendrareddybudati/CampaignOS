from app.infrastructure.database import SessionLocal
from app.domain import models
db = SessionLocal()
print(db.query(models.EventLog).all())
