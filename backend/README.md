# HireMind Backend

AI-powered recruitment screening backend for the **HireMind** platform.
This module covers 3 core backend features:

1. Resume Intelligence Engine (PDF/DOCX parsing + NLP extraction)
2. Job Fit Scoring Engine (skill match + experience match + semantic similarity)
3. Candidate Ranking API (batch scoring + ranked list)

Built with FastAPI, spaCy, sentence-transformers, SQLAlchemy (PostgreSQL), and Redis (optional).

---

## Architecture

```
hiremind-backend/
├── app/
│   ├── main.py                 # FastAPI entrypoint
│   ├── core/
│   │   ├── config.py           # Env-based settings (Pydantic)
│   │   └── database.py         # SQLAlchemy engine + session
│   ├── routes/
│   │   ├── health.py
│   │   ├── resume.py           # POST /upload-resume
│   │   ├── scoring.py          # POST /analyze-fit
│   │   └── ranking.py          # POST /rank-candidates
│   ├── services/
│   │   ├── nlp_engine.py       # Shared spaCy + embedding singleton
│   │   ├── resume_service.py   # Resume Intelligence Engine
│   │   ├── scoring_service.py  # Job Fit Scoring Engine
│   │   └── ranking_service.py  # Candidate Ranking Service
│   ├── models/models.py        # SQLAlchemy ORM
│   ├── schemas/                # Pydantic request/response schemas
│   └── utils/
│       ├── file_parser.py      # PDF/DOCX text extraction
│       ├── skills_db.py        # Curated skills vocabulary
│       └── logger.py           # Loguru setup
├── requirements.txt
└── .env.example
```

---

## Team split (4 members)

| Member | Module | Files |
| ------ | ------ | ----- |
| **You (Backend / AI)** | Resume Intelligence + Scoring + Ranking | `app/services/*`, `app/routes/*`, `app/utils/*` |
| Member 2 | Frontend (already done) | — |
| Member 3 | ATS integration APIs + interview analytics | extend `app/routes/` |
| Member 4 | Devops / Deployment + benchmarks | deployment scripts, CI, benchmarks |

---

## Quick start (local)

```bash
# 1. Clone & enter
cd hiremind-backend

# 2. Create virtual env
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 3. Install
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# 4. Configure env
cp .env.example .env
# -> edit DATABASE_URL if needed

# 5. Run
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs` for the auto-generated Swagger UI.

## API Endpoints

Base prefix: `/api/v1`

### 1. `POST /api/v1/resumes/upload-resume`
Upload a PDF/DOCX resume. Returns parsed JSON.

```bash
curl -X POST -F "file=@john_doe.pdf" \
     http://localhost:8000/api/v1/resumes/upload-resume
```

Response:
```json
{
  "success": true,
  "data": {
    "filename": "john_doe.pdf",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+11234567890",
    "skills": ["python", "fastapi", "postgresql"],
    "experience_years": 5.0,
    "education": ["B.Tech in Computer Science"],
    "raw_text": "..."
  }
}
```

### 2. `POST /api/v1/scoring/analyze-fit`
Score a parsed resume against a job description.

```json
{
  "resume": {
    "name": "Jane Doe",
    "skills": ["python", "fastapi", "docker"],
    "experience_years": 4,
    "education": ["B.Sc CS"],
    "raw_text": "Jane Doe - Python Backend Engineer ..."
  },
  "job_description": "Looking for a Python backend engineer with 3+ years building REST APIs using FastAPI, Postgres and Docker."
}
```

Response:
```json
{
  "fit_score": 82.45,
  "skill_match": 75.0,
  "experience_match": 100.0,
  "semantic_similarity": 74.5,
  "missing_skills": ["postgresql"],
  "matched_skills": ["python", "fastapi", "docker"],
  "required_experience_years": 3.0,
  "candidate_experience_years": 4.0,
  "recommendation": "Strong Fit"
}
```

### 3. `POST /api/v1/ranking/rank-candidates`
Batch score + return ranked candidates (highest first).

```json
{
  "resumes": [ { ... }, { ... } ],
  "job_description": "..."
}
```

---

## Scoring formula

```
fit_score = 0.4 * skill_match + 0.3 * experience_match + 0.3 * semantic_similarity
```

Recommendation buckets:
- `>= 75` → Strong Fit
- `>= 50` → Moderate
- `< 50`  → Reject

These thresholds live in `app/services/scoring_service.py` (`STRONG_FIT_THRESHOLD`, `MODERATE_THRESHOLD`) — easy to tune.

---

## Environment variables (.env)

| Key | Purpose |
| --- | ------- |
| `DATABASE_URL` | Postgres DSN |
| `REDIS_URL` | Redis DSN (for background jobs) |
| `EMBEDDING_MODEL` | sentence-transformers model name |
| `SPACY_MODEL` | spaCy pipeline name |
| `MAX_FILE_SIZE_MB` | Upload cap |
| `LOG_LEVEL` / `LOG_FILE` | Loguru config |

---

## Logs

Written to `./logs/hiremind.log` (rotated at 10 MB, kept 10 days).
Also streamed to stdout in colour for development.

---

## Extending

- **More skills:** extend `app/utils/skills_db.py` or swap for a DB-backed taxonomy (ESCO / O*NET).
- **Better NER / education extraction:** replace regex with a fine-tuned spaCy model.
- **Background jobs:** offload heavy parses to Redis + RQ (already in `requirements.txt`).
- **ATS connectors:** add new routers under `app/routes/` and keep service logic isolated.
