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
- [ ] Create the project: `npx create-next-app@latest task-management-frontend --typescript --app --eslint` → lives at `day-7/task-management-frontend/`
- [ ] Confirm Tailwind/`src` prompts answered consistently (Tailwind optional now — added properly on Day 9)
- [ ] Run the dev server (`npm run dev`) and confirm the default page renders
   - **Port note:** port 3000 is held by the WSL-relayed Rolai app — run the frontend on **3002** (`next dev -p 3002`); backend stays on 3001
- [ ] Add `NEXT_PUBLIC_API_URL=http://localhost:3001` to `.env.local`; commit `.env.example`
- [ ] `.gitignore` excludes `node_modules`, `.next`, `.env.local`

## 3. Routing & layouts — structure the app
- [ ] Define the root `app/layout.tsx` with `<html>`/`<body>` and shared header/nav
- [ ] Create the home page `app/page.tsx`
- [ ] Create the tasks route `app/tasks/page.tsx` (listing)
- [ ] Create the dynamic detail route `app/tasks/[id]/page.tsx`
- [ ] Add a nested `app/tasks/layout.tsx` if shared task-section chrome is needed

## 4. Build — task listing page (Server Component)
- [ ] Create a typed API helper (`lib/api.ts`) with `getTasks()` and `getTask(id)` matching the backend response shape `{ data, total, page, limit }`
- [ ] Define a `Task` type mirroring the backend (`id`, `title`, `description`, `status`, `createdAt`)
- [ ] `app/tasks/page.tsx` fetches tasks in a Server Component and renders the list
- [ ] Each task links to `/tasks/[id]`
- [ ] Empty state when there are no tasks

## 5. Build — task detail page (dynamic route)
- [ ] `app/tasks/[id]/page.tsx` reads `params.id` and fetches a single task via `getTask(id)`
- [ ] Render full task details (title, description, status, timestamps)
- [ ] Handle the "task not found" case (404 → `notFound()` / `not-found.tsx`)

## 6. Loading & error states
- [ ] Add `app/tasks/loading.tsx` — shown while the listing fetch resolves
- [ ] Add `app/tasks/[id]/loading.tsx` for the detail fetch
- [ ] Add `app/tasks/error.tsx` (Client Component) to catch fetch failures gracefully
- [ ] Confirm the backend-down case shows the error UI, not a crash

## 7. Verify — manual smoke test
- [ ] Backend running on 3001 with seeded data; frontend on 3002
- [ ] `/tasks` lists tasks fetched from the NestJS backend
- [ ] Clicking a task navigates to `/tasks/:id` and shows its detail
- [ ] Unknown task id shows the not-found UI
- [ ] Stopping the backend triggers the error UI on `/tasks`

## 8. Ship
- [ ] `README.md` with run instructions (frontend port, `NEXT_PUBLIC_API_URL`, backend dependency)
- [ ] Commit with a clean message
- [ ] Push to GitHub

---

## Success Criteria (from next.md)
- [ ] Next.js project created for the Task Management frontend
- [ ] Understands Server vs Client Components (documented in notes)
- [ ] File-based routing implemented (`app/` pages + dynamic route)
- [ ] Pages with shared layouts created
- [ ] Task listing and detail pages built
- [ ] Data fetched from the Task Management backend API
- [ ] Loading and error states handled
- [ ] Frontend displays tasks from the backend
