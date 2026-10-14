from app.infrastructure.database import SessionLocal, engine
from app.domain import models
from app.core import auth

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    print(db.query(models.User).all())
except Exception as e:
    print("Error:", e)
