"""Health-check endpoint."""
from fastapi import APIRouter

from app import __version__
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": __version__,
        "env": settings.APP_ENV,
    }
