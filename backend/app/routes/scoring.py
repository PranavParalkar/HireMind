"""Scoring endpoint: analyze fit of a parsed resume against a JD."""
from fastapi import APIRouter, Depends, HTTPException

from app.schemas.scoring import AnalyzeFitRequest, FitScoreResponse
from app.services.scoring_service import ScoringService
from app.utils.logger import logger

router = APIRouter(prefix="/scoring", tags=["Scoring"])

_scoring_service: ScoringService | None = None


def get_scoring_service() -> ScoringService:
    global _scoring_service
    if _scoring_service is None:
        _scoring_service = ScoringService()
    return _scoring_service


@router.post(
    "/analyze-fit",
    response_model=FitScoreResponse,
    summary="Compute job fit score for a single candidate",
)
async def analyze_fit(
    payload: AnalyzeFitRequest,
    service: ScoringService = Depends(get_scoring_service),
):
    """Compute skill-match, experience-match, semantic similarity and final fit score."""
    try:
        result = service.score(payload.resume.model_dump(), payload.job_description)
        return FitScoreResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:  # pragma: no cover
        logger.exception("Unexpected error in analyze_fit")
        raise HTTPException(status_code=500, detail=f"Scoring failed: {exc}")
