# 5. Loading, error, and not-found conventions

## The problem these files solve

When a Server Component awaits data, the page is blank until the fetch resolves. When a fetch throws, the whole tree crashes. Next.js solves both problems automatically — if you place a `loading.tsx` or `error.tsx` file next to a `page.tsx`, Next.js wraps that segment in the right React primitive for you.

## loading.tsx — automatic Suspense

Next.js wraps the `page.tsx` in a `<Suspense>` boundary. While the page's async work is pending, React renders `loading.tsx` instead. When the data is ready, the real page replaces it.

You do not write any `<Suspense>` tags yourself — the file being present is enough.

```
app/tasks/loading.tsx   → shown while app/tasks/page.tsx is resolving
```

`loading.tsx` is a **Server Component** by default. It renders immediately (no data to wait for), so it should be fast and contain only static markup or skeleton UI.

## error.tsx — automatic Error Boundary

Next.js wraps the segment in an `<ErrorBoundary>`. If the page throws (during render or in a Server Component fetch), React catches it and renders `error.tsx` instead.

`error.tsx` **must be a Client Component** (`'use client'`) because Error Boundary lifecycle methods require the browser. It receives two props:
- `error` — the caught Error object (includes an optional `digest` for server-side error correlation).
- `reset` — a function to retry rendering the segment.

## not-found.tsx — explicit 404 handling

`not-found.tsx` is rendered when `notFound()` (from `next/navigation`) is called anywhere in that route segment. It does not catch errors — it handles the deliberate "this resource does not exist" case.

Unlike `error.tsx`, it does not need `'use client'`.

## How it is used in this project

**`app/tasks/loading.tsx`** — shown while the tasks page loads:

```tsx
import { TaskListSkeleton } from '@/components/TaskListSkeleton'

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <TaskListSkeleton />
    </main>
  )
}
```

`TaskListSkeleton` renders pulsing placeholder cards that match the shape of real task cards — the user sees structure immediately instead of a blank screen.

**`app/tasks/error.tsx`** — catches fetch failures on `/tasks`:

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main ...>
      <h2>Something went wrong loading tasks.</h2>
      <button onClick={() => reset()}>Try again</button>
    </main>
  )
}
```

Clicking "Try again" calls `reset()`, which tells Next.js to re-render the segment — effectively re-running the failed fetch. This is how the "backend-down" case is handled gracefully.

**`app/tasks/[id]/not-found.tsx`** — shown when a task id does not exist:

```tsx
export default function NotFound() {
  return (
    <main ...>
      <h2>Task not found</h2>
      <p>The task you are looking for does not exist.</p>
      <Link href="/tasks">Back to tasks</Link>
    </main>
  )
}
```

In this project the not-found state is detected inside `TaskDetailView` (a Client Component) which sets an internal `status` state to `'not-found'` and renders inline. The `not-found.tsx` file exists as a fallback for any Server Component path that might call `notFound()` in the future.

## Segment scope

Each `loading.tsx` and `error.tsx` applies only to its own segment and its children — not to parent segments. The root layout and `SiteHeader` are always visible; only the `{children}` slot is replaced by the loading or error UI. This means the nav stays usable even when a page errors.

## Summary

| File | React primitive | Must be `'use client'`? | When rendered |
|---|---|---|---|
| `loading.tsx` | `<Suspense>` fallback | No | While page data is pending |
| `error.tsx` | `<ErrorBoundary>` fallback | Yes | When the page throws |
| `not-found.tsx` | Custom 404 UI | No | When `notFound()` is called |
