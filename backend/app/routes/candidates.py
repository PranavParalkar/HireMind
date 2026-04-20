"""Candidates CRUD routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import Candidate, User
from app.schemas.dashboard import (
    CandidateCreate,
    CandidateListResponse,
    CandidateOut,
    CandidateStatusUpdate,
)

router = APIRouter(prefix="/candidates", tags=["Candidates"])

VALID_STATUSES = {"new", "screening", "interview", "offer", "hired", "rejected"}


@router.get("", response_model=CandidateListResponse)
def list_candidates(
    status: str = None,
    job_id: int = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    q = db.query(Candidate)
    if status:
        q = q.filter(Candidate.status == status)
    if job_id:
        q = q.filter(Candidate.job_id == job_id)
    candidates = q.order_by(Candidate.fit_score.desc()).all()
    return CandidateListResponse(total=len(candidates), data=candidates)


@router.post("", response_model=CandidateOut, status_code=status.HTTP_201_CREATED)
def create_candidate(
    payload: CandidateCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    candidate = Candidate(**payload.model_dump())
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/{candidate_id}", response_model=CandidateOut)
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    return c


@router.patch("/{candidate_id}/status", response_model=CandidateOut)
def update_status(
    candidate_id: int,
    payload: CandidateStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=422, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")
    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    c.status = payload.status
    db.commit()
    db.refresh(c)
    return c


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    c = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidate not found.")
    db.delete(c)
    db.commit()
