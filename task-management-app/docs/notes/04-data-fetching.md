# 4. Data fetching — lib/api.ts and fetch in the App Router

## How data fetching works in the App Router

Server Components can be `async` functions. That means you can `await` data directly inside the component — no `useEffect`, no loading state management, no extra library. React renders the component when the data resolves.

```tsx
// conceptual example
export default async function TasksPage() {
  const { data } = await getTasks()   // runs on the server
  return <ul>{data.map(t => <li key={t.id}>{t.title}</li>)}</ul>
}
```

The fetch runs once on the server, the HTML arrives at the browser already populated. No client-side waterfall.

## fetch and caching

Next.js extends the native `fetch` API with caching options via the `cache` option:

- `cache: 'no-store'` — fetch fresh data on every request (no caching). Use for anything that changes frequently.
- `cache: 'force-cache'` — cache the response indefinitely (or until `revalidate` triggers). Use for content that rarely changes.
- `next: { revalidate: 60 }` — re-fetch in the background at most every 60 seconds (Incremental Static Regeneration).

## The API helper: lib/api.ts

Rather than calling `fetch` inline in every component, this project centralises all backend calls in `lib/api.ts`. It exports typed functions and the `Task` type that mirrors the NestJS entity.

**Types defined in lib/api.ts:**

```ts
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE'

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  userId: string | null
  createdAt: string
  updatedAt: string
}

export type Paginated<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}
```

**The URL helper** reads the environment variable set in `.env.local`:

```ts
function apiUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
  // resolves to e.g. http://localhost:3001/tasks
}
```

**getTasks** and **getTask** — the two read functions from Day 7:

```ts
export async function getTasks(page = 1, limit = 10): Promise<Paginated<Task>> {
  const res = await fetch(apiUrl(`/tasks?page=${page}&limit=${limit}`), {
    cache: 'no-store',
    headers: { ...authHeaders() },
  })
  if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`)
  return res.json()
}

export async function getTask(id: string): Promise<Task | null> {
  const res = await fetch(apiUrl(`/tasks/${id}`), {
    cache: 'no-store',
    headers: { ...authHeaders() },
  })
  if (res.status === 404) return null   // caller decides how to handle not-found
  if (!res.ok) throw new Error(`Failed to fetch task: ${res.status}`)
  return res.json()
}
```

Both use `cache: 'no-store'` because task data changes frequently. Both propagate errors by throwing — the nearest `error.tsx` catches thrown errors automatically.

## How the project actually fetches data

Because this project added authentication after Day 7, data fetching moved from Server Components into Client Components (`TasksView`, `TaskDetailView`). The functions in `lib/api.ts` are called from `useEffect` hooks so the auth token (stored in `localStorage`) can be read in the browser:

```ts
// components/TasksView.tsx (Client Component)
useEffect(() => {
  getTasks()
    .then(res => setTasks(res.data))
    .catch(err => setError(err.message))
}, [])
```

The `lib/api.ts` helpers are the same either way — the same `getTasks()` and `getTask()` functions work from both Server and Client Components. The difference is *where* the `await` runs: server-side in an async Server Component, or browser-side inside `useEffect`.

## Key insight

`lib/api.ts` is deliberately framework-agnostic. It is plain TypeScript functions wrapping `fetch`. Nothing in it is tied to React or Next.js — which is why it works in both Server and Client Component contexts without modification.
