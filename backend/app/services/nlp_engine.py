"""Singleton holder for heavy NLP / embedding models.

Models are lazy-loaded on first access so the API can start fast and
multiple services share a single instance in memory.
"""
from functools import lru_cache
from typing import Optional

from app.core.config import settings
from app.utils.logger import logger


class NLPEngine:
    _spacy_nlp = None
    _embedder = None

    @classmethod
    def get_spacy(cls):
        if cls._spacy_nlp is None:
            import spacy
            try:
                logger.info(f"Loading spaCy model: {settings.SPACY_MODEL}")
                cls._spacy_nlp = spacy.load(settings.SPACY_MODEL)
            except OSError:
                logger.warning(
                    f"spaCy model '{settings.SPACY_MODEL}' not found. "
                    "Download with: python -m spacy download en_core_web_sm"
                )
                # Fallback to blank English pipeline
                cls._spacy_nlp = spacy.blank("en")
        return cls._spacy_nlp

    @classmethod
    def get_embedder(cls):
        if cls._embedder is None:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading sentence-transformers model: {settings.EMBEDDING_MODEL}")
            cls._embedder = SentenceTransformer(settings.EMBEDDING_MODEL)
        return cls._embedder


@lru_cache()
def get_nlp_engine() -> NLPEngine:
    return NLPEngine()
