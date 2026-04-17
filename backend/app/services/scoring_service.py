"""Job Fit Scoring Engine.

Given a parsed resume dict and a job description, computes:
    - skill_match (%)
    - experience_match (%)
    - semantic_similarity (cosine)
    - final fit_score (weighted)
    - missing_skills
    - recommendation (Strong Fit / Moderate / Reject)
"""
import re
from typing import Dict, List, Tuple

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.services.nlp_engine import get_nlp_engine
from app.utils.logger import logger
from app.utils.skills_db import SKILLS_VOCAB, canonical


# Weights per spec: 0.4 skill + 0.3 experience + 0.3 semantic
W_SKILL = 0.4
W_EXP = 0.3
W_SEM = 0.3

# Recommendation thresholds (tune per org)
STRONG_FIT_THRESHOLD = 75.0
MODERATE_THRESHOLD = 50.0


class ScoringService:
    """Compute fit scores between resumes and job descriptions."""

    def __init__(self):
        self.embedder = get_nlp_engine().get_embedder()

    # -------------------------------------------------------------
    # Public API
    # -------------------------------------------------------------
    def score(self, resume: Dict, job_description: str) -> Dict:
        """Compute a fit score for a single resume against a JD."""
        if not job_description or not job_description.strip():
            raise ValueError("Job description must not be empty.")

        jd_skills = self._extract_jd_skills(job_description)
        required_years = self._extract_required_experience(job_description)

        skill_match_pct, missing_skills = self._skill_match(
            resume.get("skills", []), jd_skills
        )
        experience_match_pct = self._experience_match(
            float(resume.get("experience_years", 0.0) or 0.0),
            required_years,
        )
        semantic_similarity_pct = self._semantic_similarity(
            resume.get("raw_text") or self._resume_summary(resume),
            job_description,
        )

        final_score = (
            W_SKILL * skill_match_pct
            + W_EXP * experience_match_pct
            + W_SEM * semantic_similarity_pct
        )
        final_score = round(final_score, 2)

        recommendation = self._recommendation(final_score)

        cand_canon = {canonical(s) for s in resume.get("skills", [])}
        jd_canon = {canonical(s) for s in jd_skills}

        result = {
            "fit_score": final_score,
            "skill_match": round(skill_match_pct, 2),
            "experience_match": round(experience_match_pct, 2),
            "semantic_similarity": round(semantic_similarity_pct, 2),
            "missing_skills": missing_skills,
            "matched_skills": sorted(cand_canon & jd_canon),
            "required_experience_years": required_years,
            "candidate_experience_years": float(
                resume.get("experience_years", 0.0) or 0.0
            ),
            "recommendation": recommendation,
        }

        logger.info(
            f"Scored candidate '{resume.get('name') or resume.get('filename')}': "
            f"fit={final_score}, reco={recommendation}"
        )
        return result

    # -------------------------------------------------------------
    # Component scorers
    # -------------------------------------------------------------
    @staticmethod
    def _skill_match(
        candidate_skills: List[str], jd_skills: List[str]
    ) -> Tuple[float, List[str]]:
        if not jd_skills:
            return 0.0, []
        candidate_set = {canonical(s) for s in candidate_skills}
        jd_set = {canonical(s) for s in jd_skills}
        matched = candidate_set & jd_set
        missing = sorted(jd_set - candidate_set)
        pct = (len(matched) / len(jd_set)) * 100.0
        return pct, missing

    @staticmethod
    def _experience_match(candidate_years: float, required_years: float) -> float:
        if required_years <= 0:
            # No explicit requirement -> neutral full score
            return 100.0
        if candidate_years >= required_years:
            return 100.0
        return round((candidate_years / required_years) * 100.0, 2)

    def _semantic_similarity(self, resume_text: str, jd_text: str) -> float:
        if not resume_text.strip() or not jd_text.strip():
            return 0.0
        embeddings = self.embedder.encode(
            [resume_text, jd_text], convert_to_numpy=True, normalize_embeddings=True
        )
        sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        # cosine with normalized vectors is in [-1, 1]; clamp to [0, 1] then to %
        sim = max(0.0, float(sim))
        return round(sim * 100.0, 2)

    # -------------------------------------------------------------
    # JD helpers
    # -------------------------------------------------------------
    @staticmethod
    def _extract_jd_skills(jd_text: str) -> List[str]:
        lower = jd_text.lower()
        found = set()
        for skill in SKILLS_VOCAB:
            escaped = re.escape(skill)
            if any(c in skill for c in ".+#"):
                pattern = r"(?<![A-Za-z0-9+#.])" + escaped + r"(?![A-Za-z0-9+#.])"
            else:
                pattern = r"\b" + escaped + r"\b"
            if re.search(pattern, lower):
                found.add(canonical(skill))
        return sorted(found)

    @staticmethod
    def _extract_required_experience(jd_text: str) -> float:
        """Look for patterns like '3+ years', 'minimum 5 years', '2-4 yrs'."""
        patterns = [
            r"(\d{1,2})\s*\+\s*(?:years?|yrs?)",
            r"minimum\s+(?:of\s+)?(\d{1,2})\s*(?:years?|yrs?)",
            r"at\s+least\s+(\d{1,2})\s*(?:years?|yrs?)",
            r"(\d{1,2})\s*[-–]\s*\d{1,2}\s*(?:years?|yrs?)",
            r"(\d{1,2})\s*(?:years?|yrs?)\s*(?:of)?\s*experience",
        ]
        for p in patterns:
            m = re.search(p, jd_text, re.IGNORECASE)
            if m:
                try:
                    return float(m.group(1))
                except (ValueError, IndexError):
                    continue
        return 0.0

    @staticmethod
    def _resume_summary(resume: Dict) -> str:
        """Build a synthetic summary when raw_text isn't available."""
        parts = []
        if resume.get("name"):
            parts.append(resume["name"])
        if resume.get("skills"):
            parts.append("Skills: " + ", ".join(resume["skills"]))
        if resume.get("experience_years"):
            parts.append(f"Experience: {resume['experience_years']} years")
        if resume.get("education"):
            parts.append("Education: " + "; ".join(resume["education"]))
        return ". ".join(parts)

    @staticmethod
    def _recommendation(fit_score: float) -> str:
        if fit_score >= STRONG_FIT_THRESHOLD:
            return "Strong Fit"
        if fit_score >= MODERATE_THRESHOLD:
            return "Moderate"
        return "Reject"
