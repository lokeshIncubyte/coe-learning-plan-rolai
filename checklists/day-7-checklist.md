# Day 7 Checklist — Next.js App Router & First Pages

**Project:** Task Management App — start building the frontend
**Reference:** [`next.md`](../next.md), Next.js docs (App Router, TypeScript, Server Components)
**Directory:** new project at `day-7/task-management-frontend/` (frontend lives separately from the NestJS backend)
**Backend:** NestJS API on `http://localhost:3001` — `GET /tasks` (paginated `?page&limit`), `GET /tasks/:id`

---

## 1. Learn — concepts before code
- [ ] Next.js App Router architecture: `app/` directory, route segments, the request lifecycle → [`notes/01-app-router.md`]
- [ ] Server Components vs Client Components — what runs where, when to reach for `'use client'` → [`notes/02-server-vs-client.md`]
- [ ] File-based routing in `app/`: `page.tsx`, `layout.tsx`, nested routes, route groups → [`notes/03-file-routing.md`]
- [ ] Dynamic routes: `[id]` segments and the `params` prop → absorb into note 03
- [ ] Data fetching in Server Components: `async` components, `fetch`, caching/revalidation → [`notes/04-data-fetching.md`]
- [ ] Loading and error UI conventions: `loading.tsx`, `error.tsx`, Suspense boundaries → [`notes/05-loading-error.md`]

## 2. Setup — scaffold the frontend
- [x] Create the project: `npx create-next-app@latest task-management-frontend --typescript --app --eslint` → lives at `day-7/task-management-frontend/`
- [x] Confirm Tailwind/`src` prompts answered consistently (Tailwind optional now — added properly on Day 9)
- [x] Run the dev server (`npm run dev`) and confirm the default page renders
   - **Port note:** port 3000 is held by the WSL-relayed Rolai app — run the frontend on **3002** (`next dev -p 3002`); backend stays on 3001
- [x] Add `NEXT_PUBLIC_API_URL=http://localhost:3001` to `.env.local`; commit `.env.example`
- [x] `.gitignore` excludes `node_modules`, `.next`, `.env.local`

## 3. Routing & layouts — structure the app
- [x] Define the root `app/layout.tsx` with `<html>`/`<body>` and shared header/nav
- [x] Create the home page `app/page.tsx`
- [x] Create the tasks route `app/tasks/page.tsx` (listing)
- [x] Create the dynamic detail route `app/tasks/[id]/page.tsx`
- [x] Add a nested `app/tasks/layout.tsx` if shared task-section chrome is needed

## 4. Build — task listing page (Server Component)
- [x] Create a typed API helper (`lib/api.ts`) with `getTasks()` and `getTask(id)` matching the backend response shape `{ data, total, page, limit }`
- [x] Define a `Task` type mirroring the backend (`id`, `title`, `description`, `status`, `createdAt`)
- [x] `app/tasks/page.tsx` fetches tasks in a Server Component and renders the list
- [x] Each task links to `/tasks/[id]`
- [x] Empty state when there are no tasks

## 5. Build — task detail page (dynamic route)
- [x] `app/tasks/[id]/page.tsx` reads `params.id` and fetches a single task via `getTask(id)`
- [x] Render full task details (title, description, status, timestamps)
- [x] Handle the "task not found" case (404 → `notFound()` / `not-found.tsx`)

## 6. Loading & error states
- [x] Add `app/tasks/loading.tsx` — shown while the listing fetch resolves
- [x] Add `app/tasks/[id]/loading.tsx` for the detail fetch
- [x] Add `app/tasks/error.tsx` (Client Component) to catch fetch failures gracefully
- [x] Confirm the backend-down case shows the error UI, not a crash

## 7. Verify — manual smoke test
- [x] Backend running on 3001 with seeded data; frontend on 3002
- [x] `/tasks` lists tasks fetched from the NestJS backend
- [x] Clicking a task navigates to `/tasks/:id` and shows its detail
- [x] Unknown task id shows the not-found UI
- [x] Stopping the backend triggers the error UI on `/tasks`

## 8. Ship
- [x] `README.md` with run instructions (frontend port, `NEXT_PUBLIC_API_URL`, backend dependency)
- [x] Commit with a clean message
- [x] Push to GitHub

---

## Success Criteria (from next.md)
- [x] Next.js project created for the Task Management frontend
- [ ] Understands Server vs Client Components (documented in notes)
- [x] File-based routing implemented (`app/` pages + dynamic route)
- [x] Pages with shared layouts created
- [x] Task listing and detail pages built
- [x] Data fetched from the Task Management backend API
- [x] Loading and error states handled
- [x] Frontend displays tasks from the backend
