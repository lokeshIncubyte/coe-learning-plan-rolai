# Deployment Guide — Task Management App

The app has three pieces:

| Piece | Tech | Suggested host |
|-------|------|----------------|
| Database | PostgreSQL | [Neon](https://neon.tech) (already used in dev) |
| Backend API | NestJS 11 + Prisma 7 | [Railway](https://railway.app) or [Render](https://render.com) |
| Frontend | Next.js 16 (App Router) | [Vercel](https://vercel.com) |

---

## 1. Database (Neon)

Already provisioned. You need the pooled connection string for the backend:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

> **WSL2/IPv4 note:** Neon resolves to both IPv4 and IPv6. Under WSL2 (no IPv6 egress) the backend forces IPv4 (`dns.setDefaultResultOrder('ipv4first')` in `src/main.ts`). Cloud hosts have IPv6, so this is harmless there.

---

## 2. Backend (`task-management-app/backend`)

**Environment variables**
```
DATABASE_URL=<neon pooled connection string>
JWT_SECRET=<a long random string>
PORT=3001                      # or whatever the host injects
```

**Build & release**
```bash
npm ci
npx prisma generate            # generates the CJS Prisma client (moduleFormat="cjs")
npx prisma migrate deploy      # applies migrations to the production DB
npm run build                  # nest build -> dist/
npm run start:prod             # node dist/src/main.js (loads .env via dotenv)
```

**Seed (optional, first deploy only)**
```bash
npx prisma db seed             # 2 users + 5 tasks
```

**CORS:** before going live, enable CORS in `src/main.ts` for the deployed
frontend origin:
```ts
app.enableCors({ origin: process.env.FRONTEND_ORIGIN, credentials: true });
```

---

## 3. Frontend (`task-management-app/frontend`)

**Environment variables**
```
NEXT_PUBLIC_API_URL=<deployed backend URL, e.g. https://api.example.com>
```

**On Vercel**
- Root directory: `task-management-app/frontend`
- Build command: `npm run build` (default)
- Output: `.next` (default)
- Add `NEXT_PUBLIC_API_URL` in Project → Settings → Environment Variables

Locally it runs on **port 3002** (`npm run dev`); 3000 is taken by Rolai and 3001 by the backend on the dev machine.

---

## 4. Local full-stack run

```bash
# terminal 1 — backend
cd task-management-app/backend && npm run start:dev      # :3001 (IPv4-patched via NODE_OPTIONS)

# terminal 2 — frontend
cd task-management-app/frontend && npm run dev           # :3002
```

`.env.local` (frontend) → `NEXT_PUBLIC_API_URL=http://localhost:3001`.

---

## 5. Verify after deploy

```bash
curl $API/tasks                                   # 200, paginated { data, total, page, limit }
curl -X POST $API/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"A","email":"a@b.com","password":"password123"}'   # 201
curl -X POST $API/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","password":"password123"}'              # 200 { access_token }
curl -X POST $API/tasks -H 'Content-Type: application/json' -d '{"title":"x"}'   # 401 (guarded)
```

Then open the frontend, log in, and confirm the task list loads and CRUD works.

---

## 6. Status / deferred

- **Done & verified locally:** backend CRUD + users + pagination + auth (JWT/bcrypt/guards) against Neon; frontend pages, CRUD, styling, auth flows (44 unit + 38 e2e frontend tests, 49 backend tests).
- **Not yet performed:** the actual cloud deploys (Vercel/Railway) and wiring the **frontend to the real backend** — the frontend e2e suite currently runs against an in-memory mock API (`frontend/e2e/mock-api`) for determinism. Point `NEXT_PUBLIC_API_URL` at the deployed backend and enable CORS to connect them for real.
