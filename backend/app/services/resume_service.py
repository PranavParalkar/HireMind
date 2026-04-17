"""Resume Intelligence Engine.

Parses a PDF/DOCX resume and extracts structured fields:
    - name
    - email, phone (bonus)
    - skills
    - experience (years)
    - education
"""
import re
from typing import Dict, List, Optional

from app.services.nlp_engine import get_nlp_engine
from app.utils.file_parser import extract_text
from app.utils.logger import logger
from app.utils.skills_db import SKILLS_VOCAB, canonical


EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(\+?\d[\d\s().-]{7,}\d)")
YEARS_RE = re.compile(
    r"(\d{1,2})\+?\s*(?:\+)?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)?",
    re.IGNORECASE,
)
DATE_RANGE_RE = re.compile(
    r"(?P<start>\b(?:19|20)\d{2})\s*[-–to]+\s*(?P<end>(?:19|20)\d{2}|present|current)",
    re.IGNORECASE,
)

EDUCATION_KEYWORDS = [
    "bachelor", "b.tech", "btech", "b.e.", "bsc", "b.sc", "ba",
    "master", "m.tech", "mtech", "m.e.", "msc", "m.sc", "mba", "ma",
    "phd", "doctorate", "diploma", "associate",
]


class ResumeService:
    """Extracts structured data from resumes."""

    def __init__(self):
        self.nlp = get_nlp_engine().get_spacy()

    # -------------------------------------------------------------
    # Public API
    # -------------------------------------------------------------
    def parse(self, filename: str, file_bytes: bytes) -> Dict:
        """Parse a resume file and return structured JSON."""
        logger.info(f"Parsing resume: {filename}")
        raw_text = extract_text(filename, file_bytes)
        if not raw_text:
            raise ValueError("No text could be extracted from the resume.")

        cleaned_text = self._clean_text(raw_text)

        result = {
            "filename": filename,
            "name": self._extract_name(cleaned_text),
            "email": self._extract_email(cleaned_text),
            "phone": self._extract_phone(cleaned_text),
            "skills": self._extract_skills(cleaned_text),
            "experience_years": self._extract_experience_years(cleaned_text),
            "education": self._extract_education(cleaned_text),
            "raw_text": cleaned_text,
        }
        logger.info(
            f"Parsed resume '{filename}': "
            f"{len(result['skills'])} skills, "
            f"{result['experience_years']} yrs exp"
        )
        return result

    # -------------------------------------------------------------
    # Helpers
    # -------------------------------------------------------------
    @staticmethod
    def _clean_text(text: str) -> str:
        text = text.replace("\r", "\n")
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{2,}", "\n\n", text)
        return text.strip()

    def _extract_name(self, text: str) -> Optional[str]:
        """Best-effort name extraction: use spaCy NER, else first non-empty line."""
        try:
            doc = self.nlp(text[:500])  # first 500 chars is usually enough
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    return ent.text.strip()
        except Exception as exc:  # pragma: no cover - spaCy blank pipelines have no ner
            logger.debug(f"spaCy NER failed for name: {exc}")

        # Fallback: first non-empty line that looks like a name
        for line in text.splitlines():
            line = line.strip()
            if (
                line
                and len(line.split()) <= 5
                and not EMAIL_RE.search(line)
                and not PHONE_RE.search(line)
                and line[0].isalpha()
            ):
                return line
        return None

    @staticmethod
    def _extract_email(text: str) -> Optional[str]:
        match = EMAIL_RE.search(text)
        return match.group(0) if match else None

    @staticmethod
    def _extract_phone(text: str) -> Optional[str]:
        match = PHONE_RE.search(text)
        if not match:
            return None
        phone = re.sub(r"[^\d+]", "", match.group(0))
        return phone if len(phone) >= 8 else None

    @staticmethod
    def _extract_skills(text: str) -> List[str]:
        """Match skills from curated vocabulary (case-insensitive, word-bounded).

        Results are collapsed via `canonical()` so aliases (e.g. "postgres"
        -> "postgresql", "k8s" -> "kubernetes") don't double-count.

        For skills containing special chars (".", "+", "#") we use stricter
        boundaries; for plain alphanumeric skills we use standard word
        boundaries so "aws." or "postgresql," don't break matching.
        """
        found = set()
        lower = text.lower()
        for skill in SKILLS_VOCAB:
            escaped = re.escape(skill)
            if any(c in skill for c in ".+#"):
                # Strict boundary for multi-char / punctuation skills
                pattern = r"(?<![A-Za-z0-9+#.])" + escaped + r"(?![A-Za-z0-9+#.])"
            else:
                pattern = r"\b" + escaped + r"\b"
            if re.search(pattern, lower):
                found.add(canonical(skill))
        return sorted(found)

    @staticmethod
    def _extract_experience_years(text: str) -> float:
        """Extract years of experience.

        Strategy:
        1. Look for explicit mentions like "5+ years of experience".
        2. Fallback: sum year ranges from job history (e.g. 2018–2022).
        """
        explicit = [int(m.group(1)) for m in YEARS_RE.finditer(text)]
        if explicit:
            return float(max(explicit))

        from datetime import datetime

        current_year = datetime.now().year
        total = 0
        for m in DATE_RANGE_RE.finditer(text):
            try:
                start = int(m.group("start"))
                end_raw = m.group("end").lower()
                end = current_year if end_raw in ("present", "current") else int(end_raw)
                if end >= start:
                    total += end - start
            except ValueError:
                continue
        return float(total)

    @staticmethod
    def _extract_education(text: str) -> List[str]:
        """Extract education lines containing known degree keywords.

        Uses word-boundary matching so "ba" doesn't match inside "backend".
        """
        found = []
        seen = set()
        # Build a single regex with word boundaries for all keywords
        escaped = [re.escape(k) for k in EDUCATION_KEYWORDS]
        kw_re = re.compile(
            r"(?<![A-Za-z0-9])(?:" + "|".join(escaped) + r")(?![A-Za-z0-9])",
            re.IGNORECASE,
        )
        for line in text.splitlines():
            line_stripped = line.strip()
            if not line_stripped or line_stripped in seen:
                continue
            if kw_re.search(line_stripped):
                found.append(line_stripped)
                seen.add(line_stripped)
        return found[:10]  # cap to 10 entries
