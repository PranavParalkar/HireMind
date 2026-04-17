"""Candidate Ranking Service.

Runs the scoring service over a list of resumes for a single JD and
returns them ordered by fit_score (highest first).
"""
from typing import Dict, List

from app.services.scoring_service import ScoringService
from app.utils.logger import logger


class RankingService:
    def __init__(self):
        self.scoring_service = ScoringService()

    def rank(self, resumes: List[Dict], job_description: str) -> List[Dict]:
        """Score each resume and return a ranked list."""
        if not resumes:
            return []
        if not job_description or not job_description.strip():
            raise ValueError("Job description must not be empty.")

        logger.info(f"Ranking {len(resumes)} candidates")
        ranked: List[Dict] = []

        for idx, resume in enumerate(resumes):
            try:
                score = self.scoring_service.score(resume, job_description)
                ranked.append(
                    {
                        "candidate_id": resume.get("id") or resume.get("filename") or f"candidate_{idx}",
                        "name": resume.get("name"),
                        "email": resume.get("email"),
                        **score,
                    }
                )
            except Exception as exc:
                logger.exception(f"Failed to score candidate #{idx}: {exc}")
                ranked.append(
                    {
                        "candidate_id": resume.get("id") or resume.get("filename") or f"candidate_{idx}",
                        "name": resume.get("name"),
                        "error": str(exc),
                        "fit_score": 0.0,
                        "recommendation": "Reject",
                    }
                )

        ranked.sort(key=lambda r: r.get("fit_score", 0.0), reverse=True)

        # Add 1-based rank index
        for i, candidate in enumerate(ranked, start=1):
            candidate["rank"] = i

        return ranked
