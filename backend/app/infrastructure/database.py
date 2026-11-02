import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./loyalty.db")

def create_app_engine(url):
    if not url or url.startswith("sqlite"):
        return create_engine("sqlite:///./loyalty.db", connect_args={"check_same_thread": False})
    try:
        eng = create_engine(
            url,
            pool_size=20,
            max_overflow=30,
            pool_pre_ping=True
        )
        with eng.connect() as conn:
            pass
        return eng
    except Exception as e:
        logger.warning(f"Failed to connect to primary database ({e}). Falling back to sqlite:///./loyalty.db")
        return create_engine("sqlite:///./loyalty.db", connect_args={"check_same_thread": False})

engine = create_app_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
