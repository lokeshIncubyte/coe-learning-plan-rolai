# CoE Learning Plan — Rolai

Incubyte Center of Excellence learning plan. Work is organized **by project**, since the main project (the Task Management App) spans many days.

## Live Task Management App

- **Frontend** (Vercel): https://task-management-rolai.vercel.app
- **Backend API** (Railway): https://backend-production-94c7.up.railway.app
- **Database**: Neon Postgres

Auth-protected — open the frontend, register/login, then use the app. Setup & redeploy steps: [`task-management-app/docs/deployment.md`](task-management-app/docs/deployment.md).

## Structure

```
.
├── checklists/                  # day-by-day checklists + requirements
├── user-stories/                # day-by-day user stories (days 3–10)
├── cycles/                      # TDD cycle plans, grouped day-3…day-6 (see cycles/README.md)
├── picsum-lab/                  # Day 2 — TypeScript Advanced & React Basics lab
├── task-management-app/
│   ├── backend/                 # Days 3–6 — NestJS + Prisma + PostgreSQL API
│   ├── frontend/                # Days 7–10 — Next.js App Router frontend
│   └── docs/
│       ├── HANDOFF.md           # historical day-3 handoff note
│       ├── notes/               # concept notes (NestJS, Prisma, …)
│       ├── references/          # source material (PDFs, etc.)
│       └── architecture.md, api-contract.md, schema-internal.md, *-concepts-map.md
└── next.md                      # raw upstream plan for days 7–10
```

## Day → work index

| Day | Topic | Where | Checklist | Status |
|-----|-------|-------|-----------|--------|
| 2 | TypeScript Advanced & React Basics | `picsum-lab/` | — | ✅ Done |
| 3 | NestJS intro & first Tasks API (in-memory) | `task-management-app/backend/` | [`checklists/checklist.md`](checklists/checklist.md) | ✅ Done |
| 4 | Modules, Providers, DTOs, full CRUD | `task-management-app/backend/` | [`checklists/day-4-checklist.md`](checklists/day-4-checklist.md) | ⚠️ Code done; commit/push checkboxes open |
| 5 | PostgreSQL & Prisma setup (Neon) | `task-management-app/backend/` | [`checklists/day-5-checklist.md`](checklists/day-5-checklist.md) | ✅ Done |
| 6 | NestJS + Prisma complete backend | `task-management-app/backend/` | [`checklists/day-6-checklist.md`](checklists/day-6-checklist.md) | ⚠️ Code done; seed run + success-criteria verify open |
| 7 | Next.js App Router & first pages | `task-management-app/frontend/` | [`checklists/day-7-checklist.md`](checklists/day-7-checklist.md) | ⬜ Planned |
| 8 | Next.js forms & client components | `task-management-app/frontend/` | [`checklists/day-8-checklist.md`](checklists/day-8-checklist.md) | ⬜ Planned |
| 9 | Styling & UX (Tailwind) | `task-management-app/frontend/` | [`checklists/day-9-checklist.md`](checklists/day-9-checklist.md) | ⬜ Planned |
| 10 | Auth basics & deployment | `backend/` + `frontend/` | [`checklists/day-10-checklist.md`](checklists/day-10-checklist.md) | ⬜ Planned |

## Ports (this machine)

- `3000` — held by the WSL-relayed Rolai app (do not use)
- `3001` — Task Management **backend** (NestJS)
- `3002` — Task Management **frontend** (Next.js, from Day 7)
