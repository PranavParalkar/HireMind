# HireMind Frontend (Single Runtime)

This Next.js app is the full HireMind runtime:
- recruiter + candidate UI
- API routes under `/api/v1`
- SQLite persistence (`data/hiremind.db`)
- local AI resume parsing/scoring/ranking

No separate Python backend is required.

## Run

```bash
npm install
npm run seed
npm run dev
```

Open http://localhost:3000.

## Environment

Create `.env.local` (or copy from `.env.example`):

```env
NEXT_PUBLIC_API_URL=/api/v1
JWT_SECRET=hiremind-secret-key-change-in-production-32ch
```

## Useful Scripts

```bash
npm run dev
npm run seed
npm run build
npm run start
npm run lint
```

## Notes

- `NEXT_PUBLIC_API_URL` should stay `/api/v1` for same-origin API routing.
- Seeding resets jobs/candidates/interviews and preserves user accounts.
