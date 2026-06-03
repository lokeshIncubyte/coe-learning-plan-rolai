# Deployment Guide — Task Management App

## 🚀 Live deployment

| Piece | Host | URL |
|-------|------|-----|
| Frontend | Vercel | **https://task-management-rolai.vercel.app** |
| Backend API | Railway | **https://backend-production-94c7.up.railway.app** |
| Database | Neon Postgres | (managed) |

Verified end-to-end: register → login (JWT) → guarded task mutations (401 without token, 201 with), task list/stats served from Neon, CORS allows the Vercel origin. The frontend protects `/tasks` — a signed-out visitor is redirected to `/login`.

---

The app has three pieces:

| Piece | Tech | Host |
|-------|------|----------------|
| Database | PostgreSQL | [Neon](https://neon.tech) |
| Backend API | NestJS 11 + Prisma 7 | [Railway](https://railway.app) |
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

## 6. Status

- **Deployed & verified end-to-end** (see Live deployment above): backend on Railway (CRUD + users + pagination + JWT/bcrypt/guards against Neon), frontend on Vercel wired to it via `NEXT_PUBLIC_API_URL`, CORS allowing the Vercel origin. 44 unit + 38 e2e frontend tests, 49 backend tests.
- **Note:** the Playwright e2e suite runs against an in-memory mock API (`frontend/e2e/mock-api`) for deterministic CI — this is intentional and separate from the live deployment.
- **Backend deploy details:** Railway service `backend` in project `task-management-rolai-api`; build `npx prisma generate && npm run build`; pre-deploy `npx prisma migrate deploy`; start `node dist/src/main.js`; env vars `DATABASE_URL`, `JWT_SECRET` (fresh prod secret), `FRONTEND_ORIGIN`.
