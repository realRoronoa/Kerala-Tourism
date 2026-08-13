from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

db_url = settings.DATABASE_URL


def create_db_engine(url: str):
    if url.startswith("sqlite"):
        return create_engine(url, connect_args={"check_same_thread": False})
    
    # Try connecting to PostgreSQL
    try:
        eng = create_engine(url, pool_pre_ping=True)
        with eng.connect() as conn:
            pass
        return eng
    except Exception:
        print("[Database Notice] PostgreSQL server on localhost:5432 unavailable. Using local SQLite database file kerala_mobility.db.")
        sqlite_url = "sqlite:///./kerala_mobility.db"
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})


engine = create_db_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
