# Day 8 Checklist — Next.js Forms & Client Components

**Project:** Task Management App — add interactive frontend features
**Reference:** [`next.md`](../next.md), Next.js docs (Forms, Server Actions), React docs (controlled inputs)
**Directory:** continues in `day-7/task-management-frontend/`
**Backend:** `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` on `http://localhost:3001`

---

## 1. Learn — concepts before code
- [ ] Client Components and the `'use client'` directive — when a component must be client-side → [`notes/06-client-components.md`]
- [ ] Form handling in Next.js: native forms vs controlled React forms → [`notes/07-forms.md`]
- [ ] Controlled components and local state with `useState` → absorb into note 07
- [ ] Server Actions for form submission (`'use server'`, `<form action={...}>`) → [`notes/08-server-actions.md`]
- [ ] Client-side validation patterns + surfacing backend 400/409 errors → [`notes/09-form-validation.md`]
- [ ] Optimistic UI updates: `useOptimistic` / local state, then reconcile → [`notes/10-optimistic-ui.md`]
- [ ] Revalidation after mutations: `revalidatePath` / `router.refresh()` → absorb into note 08

## 2. Decide — mutation strategy
- [x] Choose the mutation approach: **Server Actions** (recommended) vs client `fetch` to the API helper
- [x] Extend `lib/api.ts` with `createTask`, `updateTask(id)`, `deleteTask(id)`
- [x] Define `CreateTaskInput` / `UpdateTaskInput` types mirroring the backend DTOs

## 3. Build — create task
- [x] `app/tasks/new/page.tsx` (or a modal/form on the listing) with a Client Component form
- [x] Controlled inputs for `title`, `description`, `status` (select: OPEN / IN_PROGRESS / DONE)
- [x] Submit → `POST /tasks`; on success navigate to the new task / refresh the list
- [x] Show validation errors from the backend (400) inline

## 4. Build — edit task
- [x] `app/tasks/[id]/edit/page.tsx` pre-filled with the existing task
- [x] Submit → `PATCH /tasks/:id`; partial update, return to detail on success
- [x] Handle unknown id (404) gracefully

## 5. Build — delete task
- [x] Delete button on the task detail (and/or listing row)
- [x] Confirmation step before delete (dialog or confirm prompt)
- [x] On confirm → `DELETE /tasks/:id`; remove from the list / navigate away
- [x] Handle already-deleted (404) gracefully

## 6. Polish — validation, optimistic UI, errors
- [x] Client-side validation: required `title`, trimmed values, disable submit while pending
- [x] Optimistic UI on at least one operation (e.g. delete removes the row immediately, rolls back on failure)
- [x] Loading/pending state on submit buttons (`useFormStatus` / local pending flag)
- [x] Network/backend errors surfaced to the user (not swallowed)

## 7. Verify — full CRUD smoke test
- [x] Create a task from the UI → appears in the listing and in the backend DB
- [x] Edit a task → changes persist after refresh
- [x] Delete a task with confirmation → removed from listing and DB
- [x] Invalid submit (empty title) → blocked client-side and/or rejected with a clear message
- [x] Backend-down during submit → error shown, no silent failure

## 8. Ship
- [x] All affected pages still render; no console errors
- [x] `README.md` updated with the new create/edit/delete flows
- [x] Commit and push

---

## Success Criteria (from next.md)
- [x] Forms created with Client Components
- [x] Controlled inputs implemented
- [x] Forms submit to the NestJS backend
- [x] Form validation handled (client + backend errors)
- [x] Add / edit / delete operations implemented
- [x] Optimistic UI updates shown
- [x] Errors handled gracefully
- [x] Full CRUD works end-to-end in the Task Management app
