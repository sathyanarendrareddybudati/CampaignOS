from app.infrastructure.database import SessionLocal
from app.domain import models, schemas
from app.core import auth

db = SessionLocal()
user = schemas.UserCreate(email="test2@example.com", password="password")
db_user = db.query(models.User).filter(models.User.email == user.email).first()

hashed_password = auth.get_password_hash(user.password)
new_user = models.User(email=user.email, hashed_password=hashed_password)
db.add(new_user)
db.commit()
db.refresh(new_user)
print("Created user:", new_user.email)