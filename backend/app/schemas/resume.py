"""Pydantic schemas for resume-related endpoints."""
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class ParsedResume(BaseModel):
    filename: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience_years: float = 0.0
    education: List[str] = Field(default_factory=list)
    raw_text: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "filename": "john_doe.pdf",
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+11234567890",
                "skills": ["python", "fastapi", "postgresql"],
                "experience_years": 5.0,
                "education": ["B.Tech in Computer Science"],
                "raw_text": "...",
            }
        }


class ResumeUploadResponse(BaseModel):
    success: bool = True
    data: ParsedResume
