"""FastAPI application entrypoint for HireMind backend."""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import __version__
from app.core.config import settings
from app.core.database import init_db
from app.routes import health, ranking, resume, scoring
from app.utils.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown hooks."""
    logger.info(f"Starting {settings.APP_NAME} v{__version__} ({settings.APP_ENV})")
    # Initialise DB tables (dev convenience - use Alembic in prod)
    try:
        init_db()
        logger.info("Database initialized.")
    except Exception as exc:
        logger.warning(f"Skipping DB init: {exc}")
    yield
    logger.info("Shutting down HireMind backend.")


app = FastAPI(
    title=settings.APP_NAME,
    version=__version__,
    description="AI-powered recruitment screening & talent intelligence API.",
    lifespan=lifespan,
)

# CORS (allow frontend to call the API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": "Validation failed", "details": exc.errors()},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "Internal server error"},
    )


# ---------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(resume.router, prefix=settings.API_PREFIX)
app.include_router(scoring.router, prefix=settings.API_PREFIX)
app.include_router(ranking.router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": __version__,
        "docs": "/docs",
        "endpoints": [
            f"{settings.API_PREFIX}/health",
            f"{settings.API_PREFIX}/resumes/upload-resume",
            f"{settings.API_PREFIX}/scoring/analyze-fit",
            f"{settings.API_PREFIX}/ranking/rank-candidates",
        ],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
