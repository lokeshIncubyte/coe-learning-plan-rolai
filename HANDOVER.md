# Handover — Task Management App

Full-stack task manager built over a 10-day CoE plan. NestJS + Prisma + Neon (backend), Next.js 16 (frontend), JWT auth.

## Live
- **App:** https://task-management-rolai.vercel.app
- **API:** https://backend-production-94c7.up.railway.app
- **Login:** `demo@example.com` / `demo12345`  *(seeded Alice/Bob have no password; no sign-up page yet)*

## Repo (`github.com/lokeshIncubyte/coe-learning-plan-rolai`, branch `main`)
- `task-management-app/backend` — NestJS API (port 3001)
- `task-management-app/frontend` — Next.js app (port 3002)
- `checklists/`, `user-stories/`, `cycles/` — day-by-day plan, stories, TDD cycles
- `task-management-app/docs/deployment.md` — deploy guide & details

## Run locally
```bash
# backend  (needs .env: DATABASE_URL, JWT_SECRET)
cd task-management-app/backend && npm i && npm run start:dev
# frontend (.env.local: NEXT_PUBLIC_API_URL=http://localhost:3001)
cd task-management-app/frontend && npm i && npm run dev
```

## Test
- Backend: `npm test` (Jest, 54)
- Frontend: `npm test` (Vitest, 51) · `npm run test:e2e` (Playwright vs mock, 46)
- Live smoke: `npm run test:e2e -- --config playwright.deployed.config.ts` (1)

## Deploy
- Frontend → Vercel: `vercel deploy --prod --scope uplara` (from `frontend/`)
- Backend → Railway: `railway up --service backend` (from `backend/`); build runs `prisma generate && nest build`, pre-deploy `prisma migrate deploy`

## Known gaps
- No sign-up UI; seeded users have no passwords (register via API or add a sign-up page).
- Tasks are not scoped per user (everyone sees all tasks).
- Backend persistence stories (restart/`updatedAt`/durable-delete) lack integration tests.
- `demo@example.com` is wiped if the DB is re-seeded (`prisma db seed`).
