"""Jobs CRUD routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import Candidate, Job, User
from app.schemas.dashboard import JobCreate, JobListResponse, JobOut

router = APIRouter(prefix="/jobs", tags=["Jobs"])


def _job_out(job: Job, db: Session) -> JobOut:
    applicants = db.query(Candidate).filter(Candidate.job_id == job.id).count()
    scores = [c.fit_score for c in db.query(Candidate).filter(Candidate.job_id == job.id).all() if c.fit_score]
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0
    data = JobOut.model_validate(job)
    data.applicants = applicants
    data.avg_score = avg_score
    return data


@router.get("", response_model=JobListResponse)
def list_jobs(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    jobs = db.query(Job).order_by(Job.posted_date.desc()).all()
    return JobListResponse(total=len(jobs), data=[_job_out(j, db) for j in jobs])


@router.post("", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = Job(**payload.model_dump(), created_by=current_user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return _job_out(job, db)


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return _job_out(job, db)


@router.patch("/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    payload: JobCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(job, k, v)
    db.commit()
    db.refresh(job)
    return _job_out(job, db)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    db.delete(job)
    db.commit()
