"""SQLAlchemy ORM models for HireMind."""
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, String, Text, JSON, Enum
)
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class CandidateStatus(str, enum.Enum):
    new = "new"
    screening = "screening"
    interview = "interview"
    offer = "offer"
    hired = "hired"
    rejected = "rejected"


class JobStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    closed = "closed"


class JobType(str, enum.Enum):
    full_time = "full-time"
    part_time = "part-time"
    contract = "contract"
    remote = "remote"


class InterviewType(str, enum.Enum):
    technical = "technical"
    behavioral = "behavioral"
    cultural = "cultural"
    final = "final"


class InterviewStatus(str, enum.Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False, default="full-time")
    status = Column(String(50), nullable=False, default="active")
    description = Column(Text, nullable=True)
    skills = Column(JSON, default=list)
    posted_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    candidates = relationship("Candidate", back_populates="job", cascade="all, delete-orphan")


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    role = Column(String(255), nullable=False)
    experience = Column(String(100), nullable=True)
    skills = Column(JSON, default=list)
    status = Column(String(50), nullable=False, default="new")
    fit_score = Column(Float, default=0.0)
    resume_score = Column(Float, default=0.0)
    bias_flag = Column(Boolean, default=False)
    diversity_score = Column(Float, default=0.0)
    success_prediction = Column(Float, default=0.0)
    applied_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)

    job = relationship("Job", back_populates="candidates")
    interviews = relationship("Interview", back_populates="candidate", cascade="all, delete-orphan")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(255), nullable=False)
    date = Column(String(20), nullable=False)
    time = Column(String(20), nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="scheduled")
    rating = Column(Float, nullable=True)
    ai_insight = Column(Text, nullable=True)
    interviewer = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    candidate = relationship("Candidate", back_populates="interviews")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True, index=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    experience_years = Column(Float, default=0.0)
    skills = Column(JSON, default=list)
    education = Column(JSON, default=list)
    raw_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    scores = relationship("FitScore", back_populates="resume", cascade="all, delete-orphan")


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, default=list)
    required_experience_years = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    scores = relationship("FitScore", back_populates="job", cascade="all, delete-orphan")


class FitScore(Base):
    __tablename__ = "fit_scores"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), index=True)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), index=True, nullable=True)
    fit_score = Column(Float, nullable=False)
    skill_match = Column(Float, nullable=False)
    experience_match = Column(Float, nullable=False)
    semantic_similarity = Column(Float, nullable=False)
    missing_skills = Column(JSON, default=list)
    recommendation = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    resume = relationship("Resume", back_populates="scores")
    job = relationship("JobDescription", back_populates="scores")
