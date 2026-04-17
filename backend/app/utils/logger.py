"""Centralized logging using loguru."""
import os
import sys
from loguru import logger

from app.core.config import settings


def setup_logger():
    """Configure loguru for the application."""
    logger.remove()

    # Console
    logger.add(
        sys.stdout,
        level=settings.LOG_LEVEL,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
               "<level>{level: <8}</level> | "
               "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
               "{message}",
        colorize=True,
    )

    # File
    os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)
    logger.add(
        settings.LOG_FILE,
        level=settings.LOG_LEVEL,
        rotation="10 MB",
        retention="10 days",
        compression="zip",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
    )
    return logger


setup_logger()
