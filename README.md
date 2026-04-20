# HireMind

**AI-Powered Recruitment Screening & Talent Intelligence Platform**

A complete recruitment SaaS with separate portals for **recruiters** (manage jobs, screen candidates, schedule interviews, view analytics) and **candidates** (apply to jobs with resume, track application status). All AI features — resume parsing, skill extraction, fit scoring, ranking — run locally. No external services. Single SQLite database. Nothing hardcoded.

---

## Architecture

```
HireMind/
└── frontend/                     # Self-contained Next.js 16 app (UI + API + DB)
    ├── src/
    │   ├── app/                  # App Router pages
    │   │   ├── (recruiter)       # / /candidates /jobs /interviews /analytics /profile /settings
    │   │   ├── candidate/        # /candidate /candidate/login
    │   │   ├── apply/            # public redirect
    │   │   ├── login/            # recruiter login
    │   │   └── api/v1/           # Next.js API routes (the "backend")
    │   │       ├── auth/         # register, login, me
    │   │       ├── candidate/    # apply, my-applications (role-gated)
    │   │       ├── candidates/   # recruiter CRUD (role-gated)
    │   │       ├── jobs/         # recruiter CRUD (role-gated)
    │   │       ├── interviews/   # recruiter CRUD (role-gated)
    │   │       ├── dashboard/    # stats, analytics (role-gated)
    │   │       ├── resumes/      # upload + parse (recruiter)
    │   │       ├── scoring/      # fit score engine (recruiter)
    │   │       ├── ranking/      # batch candidate ranking (recruiter)
    │   │       ├── public/       # jobs list, anonymous apply
    │   │       └── health/
    │   ├── components/
    │   │   ├── layout/           # AppShell, Sidebar, Header
    │   │   ├── modals/           # Job, Candidate, Schedule, Complete, Confirm
    │   │   └── ui/               # Modal, StatCard, Badge, ScoreRing
    │   ├── hooks/                # useAuth, useData (+ useAnalytics)
    │   ├── lib/
    │   │   ├── db.ts             # SQLite init + migrations
    │   │   ├── auth.ts           # JWT (jose) + bcrypt
    │   │   ├── apiHelpers.ts     # authenticate, authenticateRecruiter, forbidden
    │   │   ├── resumeEngine.ts   # PDF/DOCX parsing, NLP extraction, fit scoring
    │   │   ├── skillsDb.ts       # skills vocabulary (~300 entries)
    │   │   └── api.ts            # fetch wrapper with JWT + postForm
    │   └── types/                # TypeScript interfaces
    ├── data/hiremind.db          # SQLite file (auto-created)
    ├── seed.ts                   # idempotent demo data seeding
    ├── .env.local                # NEXT_PUBLIC_API_URL, JWT_SECRET
    └── package.json
```

There is no separate Python backend. The Next.js app is the entire stack.

---

## Prerequisites

- **Node.js 18+**

That's it. No Python, no PostgreSQL, no Redis, no spaCy. All AI/NLP is pure TypeScript.

---

## Setup

```bash
cd HireMind/frontend
npm install
npm run seed    # populates SQLite with demo recruiter + candidate + 6 jobs + 8 candidates + 6 interviews
npm run dev     # starts on http://localhost:3000
```

The database is created automatically at `frontend/data/hiremind.db` on first request. Schema migrations (`role` column on users, `user_id`/`resume_filename` on candidates) run automatically.

### Environment

`frontend/.env.local` (auto-detected, no manual creation needed for defaults):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
JWT_SECRET=hiremind-secret-key-change-in-production-32ch
```

---

## Demo Accounts

| Role | Email | Password | Portal |
|---|---|---|---|
| **Recruiter** | `carter@hiremind.ai` | `password123` | http://localhost:3000/login → http://localhost:3000/ |
| **Candidate** | `alex@candidate.ai` | `password123` | http://localhost:3000/candidate/login → http://localhost:3000/candidate |

Both portals also support self-registration.

---

## Feature Inventory

### Recruiter portal (`/`)

| Page | Capabilities |
|---|---|
| **Dashboard** | Live KPI cards (active jobs, total candidates, scheduled interviews, hires this month); 6-month candidate-pipeline area chart (computed from DB); hiring funnel with live conversion rates; top 5 AI-ranked candidates; upcoming interviews; bias alert list |
| **Candidates** | Searchable/filterable list sorted by fit score or resume score; add candidate manually; click row → detail drawer with pipeline status buttons, bias flag toggle, resume filename display, schedule interview, delete; export filtered list to CSV |
| **Jobs** | Grid of job cards with live applicant count + avg fit score; create new job (modal); edit via pencil icon; delete with confirmation |
| **Interviews** | Upcoming list with schedule button; mark complete modal (star rating + AI insight notes); cancel/delete; real feedback analytics bar chart (avg rating by interview type computed from actual completed interviews) |
| **Analytics** | 4 KPI cards (avg fit score, hire success rate, bias-free score, diversity index) — all computed from DB; hiring funnel bar chart; diversity distribution pie chart (banded from `diversity_score`); prediction vs actual line chart (6 months); AI engine benchmarks (resume parsing, skill extraction, fit prediction, success prediction, bias detection) |
| **Profile** | Edit name & email → `PATCH /auth/me`, persists and updates session |
| **Settings** | Notification toggles persisted to `localStorage`; appearance panel (single theme) |

### Candidate portal (`/candidate`)

| Tab | Capabilities |
|---|---|
| **Browse Jobs** | All active job postings with location, type, required skills; "Apply Now" opens upload modal; already-applied jobs show disabled "Applied" badge |
| **My Applications** | Every submitted application with role, department, applied date, resume filename, status badge (Submitted → Screening → Interview → Offer → Hired/Rejected), live AI fit score, interview details if scheduled (date, time, type, rating) |

Applying a candidate: pick a job → upload PDF/DOCX → the server parses the resume, extracts skills, scores against the job's title + description + required skills, stores the resume blob, and creates a linked candidate row.

### Shared / public

- `GET /api/v1/public/jobs` — anonymous listing of active jobs
- `POST /api/v1/public/apply` — anonymous application (still works, creates unlinked candidate)
- `GET /api/v1/health` — health check

---

## AI & NLP Engine

Pure TypeScript, no external API calls. Located in [`src/lib/resumeEngine.ts`](frontend/src/lib/resumeEngine.ts).

### Resume parsing
- **PDF** → `pdf-parse`
- **DOCX** → `mammoth`
- Extracts: name, email (regex), phone (regex), skills (vocabulary match), years of experience (patterns + date-range arithmetic), education degrees

### Skill extraction
- Vocabulary of ~300 canonical skills in [`src/lib/skillsDb.ts`](frontend/src/lib/skillsDb.ts)
- Matched with word-boundary regex + special handling for C++, C#, .NET, etc.
- Case-insensitive with canonical normalization

### Job fit scoring
```
fit_score = 0.4 × skill_match + 0.3 × experience_match + 0.3 × semantic_similarity
```

- `skill_match` = |matched skills ∩ required skills| / |required skills| × 100
- `experience_match` = min(candidate_years / required_years, 1) × 100
- `semantic_similarity` = Jaccard index on 3+ character tokens between resume text and JD
- `recommendation`: ≥75 = "Strong Fit", ≥50 = "Moderate", else "Reject"

### Batch ranking
`POST /ranking/rank-candidates` accepts multiple parsed resumes + one JD → returns each with fit score, recommendation, and final rank sorted desc.

---

## API Reference

All routes under `/api/v1`. JWT token (24h) required where marked.

### Auth
| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/auth/register` | public | Create account. Body accepts `role` (`recruiter`\|`candidate`) |
| POST | `/auth/login` | public | Role-gated — body can include `role` to enforce |
| GET | `/auth/me` | any | Current user |
| PATCH | `/auth/me` | any | Update own name/email |

### Recruiter-only
| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/jobs` | List / create |
| GET/PATCH/DELETE | `/jobs/{id}` | Single-job ops |
| GET/POST | `/candidates` | List / manual add |
| GET/PATCH/DELETE | `/candidates/{id}` | Details, bias flag toggle, delete |
| PATCH | `/candidates/{id}/status` | Move through pipeline |
| GET/POST | `/interviews` | List / schedule |
| DELETE | `/interviews/{id}` | Cancel |
| PATCH | `/interviews/{id}/complete` | Mark complete with rating + AI insight |
| GET | `/dashboard/stats` | KPI counts |
| GET | `/dashboard/analytics` | Funnel, pipeline, diversity, predictions, accuracy (all from DB) |
| POST | `/resumes/upload-resume` | Parse a resume standalone |
| POST | `/scoring/analyze-fit` | Score a parsed resume against a JD |
| POST | `/ranking/rank-candidates` | Rank many resumes against one JD |

Non-recruiter access → `403 Recruiter access required.`

### Candidate-only
| Method | Path | Purpose |
|---|---|---|
| POST | `/candidate/apply` | Authenticated apply (file + job_id). Parses resume, scores fit, creates linked candidate row |
| GET | `/candidate/my-applications` | Candidate's own applications with job + interview details |

### Public
| Method | Path | Purpose |
|---|---|---|
| GET | `/public/jobs` | Active jobs (no auth) |
| POST | `/public/apply` | Anonymous apply (no auth) |
| GET | `/health` | Health check |

---

## Database Schema

SQLite, auto-created and auto-migrated on first query via [`src/lib/db.ts`](frontend/src/lib/db.ts).

| Table | Key columns |
|---|---|
| `users` | `id`, `name`, `email` (unique), `hashed_password`, **`role`** (recruiter\|candidate), `is_active` |
| `jobs` | `id`, `title`, `department`, `location`, `type`, `status`, `description`, `skills` (JSON), `posted_date`, `created_by` → users |
| `candidates` | `id`, `name`, `email`, `role`, `experience`, `skills` (JSON), `status`, `fit_score`, `resume_score`, `bias_flag`, `diversity_score`, `success_prediction`, `applied_date`, `job_id` → jobs, **`user_id`** → users (candidate portal), **`resume_filename`** |
| `resumes` | `id`, `filename`, `name`, `email`, `phone`, `experience_years`, `skills` (JSON), `education` (JSON), `raw_text` |
| `interviews` | `id`, `candidate_id` → candidates, `role`, `date`, `time`, `type`, `status`, `rating`, `ai_insight`, `interviewer` |

Candidates created via the candidate portal are **linked to their user account** (`user_id`) so candidates only see their own applications. Candidates created by a recruiter (manual add) or the legacy anonymous `/public/apply` route have `user_id = NULL`.

---

## Security Model

- JWT signed with HS256 (jose) — 24h expiry
- bcrypt for password hashing (10 rounds)
- **Role-gated routes:** every recruiter endpoint calls `authenticateRecruiter()`; candidate endpoints call `authenticateWithRole()` and check `role === "candidate"`
- **Login enforces role:** a recruiter email cannot log in as a candidate and vice versa
- AppShell redirects based on role — candidates hitting `/` are sent to `/candidate`, recruiters hitting `/candidate` are sent to `/`
- 401 on missing/invalid token, 403 on role mismatch
- No secrets in the repo — `JWT_SECRET` lives in `.env.local`

---

## Workflows (end-to-end)

### Candidate applies for a job
1. Go to http://localhost:3000/candidate/login, sign up or log in
2. Browse Jobs tab → "Apply Now" on any active role
3. Upload PDF/DOCX → server parses → scores → candidate row created with `user_id` linked
4. Success modal shows fit score + matched/missing skills
5. My Applications tab shows the submission with real-time status

### Recruiter reviews candidate
1. Log in at http://localhost:3000/login
2. Candidates page → new applicant appears immediately with AI fit score, skills, resume filename
3. Click row → detail modal → change pipeline status → candidate sees updated status on their dashboard
4. Detail modal → Schedule Interview → saved to DB → candidate sees interview details on their dashboard
5. Interviews page → Mark Complete → rating + AI insight stored → visible to candidate too

### Analytics
All charts on `/analytics` and `/` come from `GET /api/v1/dashboard/analytics`, which aggregates:
- KPIs (avg fit, hire success rate, bias-free %, diversity index)
- Funnel (counts by status)
- 6-month pipeline (applied / interviewed / hired per month)
- Diversity score distribution
- Prediction vs actual hire rate per month
- AI engine benchmarks (resume parsing, skill extraction, fit prediction, success prediction, bias detection)

No hardcoded numbers remain on analytics/dashboard.

---

## Project Scripts

```bash
npm run dev      # start dev server at :3000
npm run seed     # wipe candidates/jobs/interviews + re-seed demo data (user accounts preserved)
npm run build    # production build
npm run start    # run built app
npm run lint     # eslint
```

`npm run seed` is **idempotent** — runs destructive-then-insert on jobs/candidates/interviews only. User accounts (including any you register) are preserved.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + inline styles for design system |
| Database | SQLite via `better-sqlite3` (synchronous, fast, zero-config) |
| Auth | `jose` (JWT) + `bcryptjs` |
| Resume parsing | `pdf-parse` (PDF), `mammoth` (DOCX) |
| Charts | `recharts` |
| Icons | `lucide-react` |
| Animation | `framer-motion` |

---

## What's Intentionally Out of Scope

- Email notifications (the notification preferences UI exists but only persists locally)
- File storage in S3/blob — resumes' raw text is stored in SQLite directly
- Live real-time sync between recruiter and candidate (candidate refetches on load/tab switch)
- Password reset flow
- Multi-tenant / team accounts
- Production deploy config (Docker, migrations via Alembic, etc.)

Everything the UI exposes **does something real**. No dead buttons, no mock data in charts, no placeholder sections.
