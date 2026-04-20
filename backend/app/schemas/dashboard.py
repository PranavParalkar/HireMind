"""Pydantic schemas for jobs, candidates, and interviews."""
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


# ── Jobs ──────────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    department: str
    location: str
    type: str = "full-time"
    status: str = "active"
    description: Optional[str] = None
    skills: List[str] = []


class JobOut(BaseModel):
    id: int
    title: str
    department: str
    location: str
    type: str
    status: str
    description: Optional[str]
    skills: List[str]
    posted_date: datetime
    applicants: int = 0
    avg_score: float = 0.0

    model_config = {"from_attributes": True}


class JobListResponse(BaseModel):
    success: bool = True
    total: int
    data: List[JobOut]


# ── Candidates ────────────────────────────────────────────────────────────────

class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    role: str
    experience: Optional[str] = None
    skills: List[str] = []
    job_id: Optional[int] = None


class CandidateStatusUpdate(BaseModel):
    status: str


class CandidateOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    experience: Optional[str]
    skills: List[str]
    status: str
    fit_score: float
    resume_score: float
    bias_flag: bool
    diversity_score: float
    success_prediction: float
    applied_date: datetime
    job_id: Optional[int]

    model_config = {"from_attributes": True}


class CandidateListResponse(BaseModel):
    success: bool = True
    total: int
    data: List[CandidateOut]


# ── Interviews ────────────────────────────────────────────────────────────────

class InterviewCreate(BaseModel):
    candidate_id: int
    role: str
    date: str
    time: str
    type: str
    interviewer: str


class InterviewOut(BaseModel):
    id: int
    candidate_id: int
    candidate_name: str = ""
    candidate_avatar: str = ""
    role: str
    date: str
    time: str
    type: str
    status: str
    rating: Optional[float]
    ai_insight: Optional[str]
    interviewer: str

    model_config = {"from_attributes": True}


class InterviewListResponse(BaseModel):
    success: bool = True
    total: int
    data: List[InterviewOut]


# ── Dashboard ─────────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    active_jobs: int
    total_candidates: int
    scheduled_interviews: int
    hires_this_month: int
