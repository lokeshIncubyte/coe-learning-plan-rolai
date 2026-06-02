# Task Management Frontend

Next.js (App Router) frontend for the Task Management App. Built across days 7–10.
Planning checklists: [`../../checklists/`](../../checklists/) · user stories: [`../../user-stories/`](../../user-stories/).

## Stack
- Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4
- **Unit/component tests:** Vitest + React Testing Library (`*.test.tsx`)
- **e2e tests:** Playwright (`e2e/*.spec.ts`) against a self-contained mock API

## Run
```bash
npm run dev          # frontend on http://localhost:3002
```
Set the backend URL in `.env.local` (`NEXT_PUBLIC_API_URL`, default `http://localhost:3001`).
Port 3002 is used because 3000 (Rolai) and 3001 (backend) are taken on this machine.

## Test
```bash
npm test             # Vitest — unit + component tests
npm run test:e2e     # Playwright — e2e; auto-starts the mock API (:3001) + dev server (:3002)
```

### e2e mock API
`e2e/mock-api/server.mjs` is a dependency-free in-memory stand-in for the NestJS
backend implementing the documented contract (tasks CRUD + pagination + stats,
users, auth). Playwright's `webServer` starts it on `:3001` so e2e tests run
deterministically without Neon/Postgres. `POST /__test__/reset` re-seeds state.
