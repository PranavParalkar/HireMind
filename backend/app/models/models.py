"""SQLAlchemy ORM models for HireMind."""
from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True, index=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    experience_years = Column(Float, default=0.0)
    skills = Column(JSON, default=list)          # list[str]
    education = Column(JSON, default=list)       # list[str]
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
