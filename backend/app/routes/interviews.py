"""Interviews CRUD routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import Candidate, Interview, User
from app.schemas.dashboard import InterviewCreate, InterviewListResponse, InterviewOut

router = APIRouter(prefix="/interviews", tags=["Interviews"])


def _interview_out(iv: Interview, db: Session) -> InterviewOut:
    candidate = db.query(Candidate).filter(Candidate.id == iv.candidate_id).first()
    name = candidate.name if candidate else ""
    initials = "".join(p[0].upper() for p in name.split()[:2]) if name else "?"
    data = InterviewOut.model_validate(iv)
    data.candidate_name = name
    data.candidate_avatar = initials
    return data


@router.get("", response_model=InterviewListResponse)
def list_interviews(
    status: str = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    q = db.query(Interview)
    if status:
        q = q.filter(Interview.status == status)
    interviews = q.order_by(Interview.date.asc()).all()
    return InterviewListResponse(
        total=len(interviews),
        data=[_interview_out(iv, db) for iv in interviews],
    )


@router.post("", response_model=InterviewOut, status_code=status.HTTP_201_CREATED)
def create_interview(
    payload: InterviewCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    if not db.query(Candidate).filter(Candidate.id == payload.candidate_id).first():
        raise HTTPException(status_code=404, detail="Candidate not found.")
    iv = Interview(**payload.model_dump())
    db.add(iv)
    db.commit()
    db.refresh(iv)
    return _interview_out(iv, db)


@router.patch("/{interview_id}/complete", response_model=InterviewOut)
def complete_interview(
    interview_id: int,
    rating: float,
    ai_insight: str = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    iv = db.query(Interview).filter(Interview.id == interview_id).first()
    if not iv:
        raise HTTPException(status_code=404, detail="Interview not found.")
    iv.status = "completed"
    iv.rating = rating
    iv.ai_insight = ai_insight
    db.commit()
    db.refresh(iv)
    return _interview_out(iv, db)


@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    iv = db.query(Interview).filter(Interview.id == interview_id).first()
    if not iv:
        raise HTTPException(status_code=404, detail="Interview not found.")
    db.delete(iv)
    db.commit()
