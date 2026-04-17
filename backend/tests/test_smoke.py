"""Smoke tests - run without the heavy ML models loaded.

Execute with:
    pytest -q tests/test_smoke.py
"""
from app.services.resume_service import ResumeService
from app.services.scoring_service import ScoringService


SAMPLE_JD = """
We are looking for a Python backend engineer with 3+ years of experience
building scalable REST APIs using FastAPI, PostgreSQL and Docker.
Experience with Kubernetes and AWS is a plus.
"""


def test_skill_extraction_regex():
    svc = ResumeService()
    text = "John Doe, Python / FastAPI engineer, 4 years of experience. Used PostgreSQL, Docker, AWS."
    skills = svc._extract_skills(text.lower())
    assert "python" in skills
    assert "fastapi" in skills
    assert "postgresql" in skills
    assert "docker" in skills
    assert "aws" in skills


def test_experience_extraction_explicit():
    svc = ResumeService()
    assert svc._extract_experience_years("I have 5+ years of experience in Python.") == 5.0
    assert svc._extract_experience_years("8 years of experience") == 8.0


def test_required_experience_parsing():
    assert ScoringService._extract_required_experience(SAMPLE_JD) == 3.0


def test_recommendation_buckets():
    assert ScoringService._recommendation(90) == "Strong Fit"
    assert ScoringService._recommendation(60) == "Moderate"
    assert ScoringService._recommendation(10) == "Reject"
