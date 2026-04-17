"""Ranking endpoint: rank a batch of candidates for one JD."""
from fastapi import APIRouter, Depends, HTTPException

from app.schemas.scoring import (
    RankCandidatesRequest,
    RankCandidatesResponse,
    RankedCandidate,
)
from app.services.ranking_service import RankingService
from app.utils.logger import logger

router = APIRouter(prefix="/ranking", tags=["Ranking"])

_ranking_service: RankingService | None = None


def get_ranking_service() -> RankingService:
    global _ranking_service
    if _ranking_service is None:
        _ranking_service = RankingService()
    return _ranking_service


@router.post(
    "/rank-candidates",
    response_model=RankCandidatesResponse,
    summary="Rank a list of candidates by fit score for a single JD",
)
async def rank_candidates(
    payload: RankCandidatesRequest,
    service: RankingService = Depends(get_ranking_service),
):
    if not payload.resumes:
        raise HTTPException(status_code=422, detail="At least one resume is required.")
    try:
        resumes_dicts = [r.model_dump() for r in payload.resumes]
        ranked = service.rank(resumes_dicts, payload.job_description)
        results = [RankedCandidate(**item) for item in ranked]
        return RankCandidatesResponse(
            success=True,
            total=len(results),
            job_description_preview=payload.job_description[:200],
            results=results,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:  # pragma: no cover
        logger.exception("Unexpected error in rank_candidates")
        raise HTTPException(status_code=500, detail=f"Ranking failed: {exc}")
