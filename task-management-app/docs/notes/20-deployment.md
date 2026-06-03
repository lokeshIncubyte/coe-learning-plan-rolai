# 20. Deployment Basics — Vercel, Railway/Render, and Neon

## Why three separate hosts?
The app has three independent processes with different runtime requirements:

| Piece | Runtime | Suggested host |
|-------|---------|----------------|
| Database | PostgreSQL | [Neon](https://neon.tech) — serverless Postgres, free tier |
| Backend API | Node.js / NestJS | [Railway](https://railway.app) or [Render](https://render.com) |
| Frontend | Next.js | [Vercel](https://vercel.com) — built by the Next.js team |

Each one is deployed independently and wired together through environment variables.

## Environment variables are the wiring
The three services talk to each other via URLs and secrets configured as env vars — never hardcoded in source:

**Backend needs:**
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
JWT_SECRET=<a long random string>
PORT=3001
```

**Frontend needs:**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

`NEXT_PUBLIC_` is Next.js's convention for variables that are safe to expose to the browser bundle. Everything else stays server-side only.

## Backend deploy (Railway or Render)

Point the host at `task-management-app/backend`. The build and start sequence is:

```bash
npm ci
npx prisma generate        # generates the Prisma client from the schema
npx prisma migrate deploy  # applies pending migrations to the production DB
npm run build              # nest build → dist/
npm run start:prod         # node dist/src/main.js
```

Before going live, enable CORS so the frontend origin is allowed:

```ts
// src/main.ts
app.enableCors({ origin: process.env.FRONTEND_ORIGIN, credentials: true });
```

## Frontend deploy (Vercel)

Vercel detects Next.js automatically. The only configuration needed:

- **Root directory:** `task-management-app/frontend`
- **Build command:** `npm run build` (default)
- **Environment variable:** add `NEXT_PUBLIC_API_URL` in Project → Settings → Environment Variables

## Verify the deploy with curl

A quick smoke test before opening the browser:

```bash
# Public read — should return paginated tasks
curl $API/tasks

# Register a new user
curl -X POST $API/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"A","email":"a@b.com","password":"password123"}'

# Login — should return { access_token }
curl -X POST $API/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","password":"password123"}'

# Guarded route without a token — should return 401
curl -X POST $API/tasks \
  -H 'Content-Type: application/json' -d '{"title":"x"}'
```

Then open the frontend, log in, and confirm the full task CRUD flow works end-to-end.

## Local full-stack run (reference)

Two terminals, both from `task-management-app/`:

```bash
# terminal 1
cd backend && npm run start:dev      # http://localhost:3001

# terminal 2
cd frontend && npm run dev           # http://localhost:3002
```

Frontend `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:3001`.

The backend forces IPv4 (`dns.setDefaultResultOrder('ipv4first')` in `src/main.ts`) to work around WSL2's lack of IPv6 egress to Neon. Cloud hosts have full IPv6, so this setting is harmless in production.

## Key insight
Nothing in source code should know a URL or secret at build time. Environment variables let the same code run locally against a dev database and in production against a real one — the only difference is the values you inject.
