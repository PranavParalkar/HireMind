"""Pydantic schemas for scoring & ranking endpoints."""
from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.resume import ParsedResume


class AnalyzeFitRequest(BaseModel):
    resume: ParsedResume
    job_description: str = Field(..., min_length=10)

    class Config:
        json_schema_extra = {
            "example": {
                "resume": {
                    "name": "Jane Doe",
                    "email": "jane@example.com",
                    "skills": ["python", "fastapi", "docker"],
                    "experience_years": 4,
                    "education": ["B.Sc in Computer Science"],
                    "raw_text": "Jane Doe - Python Backend Engineer ...",
                },
                "job_description": "Looking for a Python backend engineer with "
                                   "3+ years of experience building REST APIs using "
                                   "FastAPI, Postgres, and Docker.",
            }
        }


class FitScoreResponse(BaseModel):
    fit_score: float
    skill_match: float
    experience_match: float
    semantic_similarity: float
    missing_skills: List[str] = Field(default_factory=list)
    matched_skills: List[str] = Field(default_factory=list)
    required_experience_years: float = 0.0
    candidate_experience_years: float = 0.0
    recommendation: str


class RankCandidatesRequest(BaseModel):
    resumes: List[ParsedResume]
    job_description: str = Field(..., min_length=10)


class RankedCandidate(FitScoreResponse):
    rank: int
    candidate_id: str
    name: Optional[str] = None
    email: Optional[str] = None
    error: Optional[str] = None


class RankCandidatesResponse(BaseModel):
    success: bool = True
    total: int
    job_description_preview: str
    results: List[RankedCandidate]
