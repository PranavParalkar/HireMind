"""Resume upload + parsing endpoint."""
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_session_factory
from app.schemas.resume import ParsedResume, ResumeUploadResponse
from app.services.resume_service import ResumeService
from app.utils.file_parser import UnsupportedFileError
from app.utils.logger import logger


def get_db_optional() -> Optional[Session]:
    """DB dependency that returns None if the DB is unavailable."""
    try:
        SessionLocal = get_session_factory()
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    except Exception as exc:
        logger.warning(f"DB unavailable for request: {exc}")
        yield None

router = APIRouter(prefix="/resumes", tags=["Resumes"])

_resume_service: ResumeService | None = None


def get_resume_service() -> ResumeService:
    global _resume_service
    if _resume_service is None:
        _resume_service = ResumeService()
    return _resume_service


@router.post(
    "/upload-resume",
    response_model=ResumeUploadResponse,
    summary="Upload a resume (PDF/DOCX) and receive parsed JSON",
)
async def upload_resume(
    file: UploadFile = File(...),
    db: Optional[Session] = Depends(get_db_optional),
    service: ResumeService = Depends(get_resume_service),
):
    """Upload a resume file and get structured data back.

    - **file**: PDF or DOCX resume.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided.",
        )

    allowed = (".pdf", ".docx")
    if not file.filename.lower().endswith(allowed):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Only {', '.join(allowed)} files are supported.",
        )

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large ({size_mb:.1f} MB). Max {settings.MAX_FILE_SIZE_MB} MB.",
        )

    try:
        parsed = service.parse(file.filename, contents)
    except UnsupportedFileError as exc:
        raise HTTPException(status_code=415, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:  # pragma: no cover
        logger.exception("Unexpected error while parsing resume")
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {exc}")

    # Best-effort persistence (don't fail the request if DB is down in dev)
    if db is not None:
        try:
            # Import inside the block so the route still works without DB tables
            from app.models.models import Resume
            db_resume = Resume(
                filename=parsed["filename"],
                name=parsed.get("name"),
                email=parsed.get("email"),
                phone=parsed.get("phone"),
                experience_years=parsed.get("experience_years", 0.0),
                skills=parsed.get("skills", []),
                education=parsed.get("education", []),
                raw_text=parsed.get("raw_text"),
            )
            db.add(db_resume)
            db.commit()
            db.refresh(db_resume)
            logger.info(f"Resume persisted with id={db_resume.id}")
        except Exception as exc:
            db.rollback()
            logger.warning(f"DB persistence skipped: {exc}")

    return ResumeUploadResponse(success=True, data=ParsedResume(**parsed))
