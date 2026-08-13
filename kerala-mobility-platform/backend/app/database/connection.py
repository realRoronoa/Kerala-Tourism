from typing import Generator
from app.core.config import settings

try:
    from sqlalchemy import create_engine  # type: ignore # pyrefly: ignore [missing-import]
    from sqlalchemy.orm import sessionmaker, DeclarativeBase  # type: ignore # pyrefly: ignore [missing-import]
except Exception:
    create_engine = None  # type: ignore
    sessionmaker = None  # type: ignore
    DeclarativeBase = object  # type: ignore

class Base(DeclarativeBase):  # type: ignore
    pass

if create_engine and settings.DATABASE_URL:
    try:
        engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    except Exception:
        engine = None
        SessionLocal = None
else:
    engine = None
    SessionLocal = None


def get_db() -> Generator:
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
