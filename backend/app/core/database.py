"""Database connection and session management (SQLAlchemy).

The engine is created lazily on first use so that importing this module
doesn't crash when the DB driver isn't installed or the DB is unreachable
(useful for tests and local dev without Postgres).
"""
from typing import Optional

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings
from app.utils.logger import logger

Base = declarative_base()

_engine: Optional[Engine] = None
_SessionLocal = None


def get_engine() -> Engine:
    """Create (or return cached) SQLAlchemy engine."""
    global _engine, _SessionLocal
    if _engine is None:
        is_sqlite = settings.DATABASE_URL.startswith("sqlite")
        kwargs = {"pool_pre_ping": True}
        if is_sqlite:
            kwargs["connect_args"] = {"check_same_thread": False}
        else:
            kwargs["pool_size"] = 10
            kwargs["max_overflow"] = 20
        _engine = create_engine(settings.DATABASE_URL, **kwargs)
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine


def get_session_factory():
    if _SessionLocal is None:
        get_engine()
    return _SessionLocal


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    SessionLocal = get_session_factory()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables. Call at startup in dev; use Alembic for prod."""
    from app.models import models  # noqa: F401 - ensures models are registered
    try:
        engine = get_engine()
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        logger.warning(f"DB init skipped ({exc.__class__.__name__}): {exc}")
