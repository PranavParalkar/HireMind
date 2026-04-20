"""Dashboard stats endpoint."""
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import Candidate, Interview, Job, User
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    active_jobs = db.query(Job).filter(Job.status == "active").count()
    total_candidates = db.query(Candidate).count()
    scheduled_interviews = db.query(Interview).filter(Interview.status == "scheduled").count()
    hires_this_month = (
        db.query(Candidate)
        .filter(Candidate.status == "hired", Candidate.applied_date >= month_start)
        .count()
    )

    return DashboardStats(
        active_jobs=active_jobs,
        total_candidates=total_candidates,
        scheduled_interviews=scheduled_interviews,
        hires_this_month=hires_this_month,
    )
