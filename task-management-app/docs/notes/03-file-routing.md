# 3. File-based routing — page.tsx, layout.tsx, and dynamic segments

## How routing works

The App Router maps the file tree directly to URLs. The rules are simple:

- A folder creates a **route segment**.
- A `page.tsx` inside that folder makes the segment publicly accessible.
- A `layout.tsx` wraps the segment and all its children.
- Special files like `loading.tsx`, `error.tsx`, and `not-found.tsx` handle UI states for that segment.

Folders without a `page.tsx` are invisible to the router — you can use them to co-locate components without exposing a URL.

## Special file names

| File | Purpose |
|---|---|
| `page.tsx` | The UI for that URL segment |
| `layout.tsx` | Persistent wrapper for this segment and its children |
| `loading.tsx` | Shown automatically while the page's data loads (Suspense wrapper) |
| `error.tsx` | Catches thrown errors in this segment (ErrorBoundary wrapper) |
| `not-found.tsx` | Rendered when `notFound()` is called from within the segment |

## Dynamic segments

A folder named with square brackets — `[id]` — captures a variable part of the URL. The captured value is passed to `page.tsx` as the `params` prop.

`app/tasks/[id]/page.tsx` matches `/tasks/anything` and receives `params.id === "anything"`.

In this project's version of Next.js, `params` is a **Promise** and must be awaited:

```tsx
export default async function TaskDetailPage({
  params,
}: PageProps<'/tasks/[id]'>) {
  const { id } = await params
  return <TaskDetailView id={id} />
}
```

Nested dynamic segments work the same way: `app/tasks/[id]/edit/page.tsx` also receives `params.id`.

## How it is used in this project

The full route tree and the URL each file handles:

```
app/
├── layout.tsx              → wraps every URL (html, body, SiteHeader)
├── page.tsx                → /
├── login/
│   └── page.tsx            → /login
└── tasks/
    ├── page.tsx            → /tasks
    ├── loading.tsx         → loading UI for /tasks
    ├── error.tsx           → error boundary for /tasks
    ├── new/
    │   └── page.tsx        → /tasks/new
    └── [id]/
        ├── page.tsx        → /tasks/:id
        ├── not-found.tsx   → rendered when getTask returns null
        └── edit/
            └── page.tsx    → /tasks/:id/edit
```

The `[id]` segment is used in two page files. Both await `params` before passing the id down:

```tsx
// app/tasks/[id]/page.tsx
const { id } = await params
return <TaskDetailView id={id} />

// app/tasks/[id]/edit/page.tsx
const { id } = await params
return <EditTaskView id={id} />
```

The root `layout.tsx` is the only layout in this project — there is no separate `app/tasks/layout.tsx`. The `SiteHeader` and `ToastProvider` that live in the root layout persist across all navigations, so moving between `/tasks` and `/tasks/42` does not re-mount the header.

## Navigation between segments

Pages link to other routes using Next.js's `<Link>` component, which handles client-side navigation without a full page reload:

```tsx
// app/page.tsx
import Link from 'next/link'
// ...
<Link href="/tasks">View Tasks</Link>

// components/TasksView.tsx
<Link href="/tasks/new">New task</Link>
```
