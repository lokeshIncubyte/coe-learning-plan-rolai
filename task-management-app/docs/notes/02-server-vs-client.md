# 2. Server Components vs Client Components

## The mental model

In the App Router, every component is a **Server Component by default**. Server Components:
- Run only on the server (or at build time).
- Can be `async` — they `await` data directly in JSX.
- Have zero JavaScript shipped to the browser for themselves.
- Cannot use `useState`, `useEffect`, browser APIs, or event handlers.

**Client Components** are opted in with the `'use client'` directive at the top of the file. They:
- Are pre-rendered on the server *and* hydrated in the browser.
- Can use all React hooks, browser APIs, and event handlers.
- Do ship JavaScript to the browser.

The `'use client'` line marks a **boundary**: everything imported by that file is also treated as client-side code. You can nest Server Components inside Client Components by passing them as `children` props, but you cannot import a Server Component from inside a Client Component file.

## When to reach for `'use client'`

Reach for it when you need:
- `useState` / `useEffect` / `useRef`
- Browser events (`onClick`, `onChange`, form submission handlers)
- Browser APIs (`localStorage`, `window`, router hooks like `useRouter`, `usePathname`)
- Third-party libraries that rely on the DOM

Keep it out of components that only render markup or fetch data — those should stay as Server Components.

## How it is used in this project

The project uses a clear **Server shell → Client leaf** pattern.

**Server Components** (no directive — the default):

| File | Role |
|---|---|
| `app/layout.tsx` | Root layout, metadata export |
| `app/page.tsx` | Home page — static markup only |
| `app/tasks/page.tsx` | Thin shell that renders `<TasksView />` |
| `app/tasks/[id]/page.tsx` | Reads `params`, renders `<TaskDetailView id={id} />` |
| `app/tasks/loading.tsx` | Static skeleton shown during streaming |
| `components/SiteHeader.tsx` | Navigation — no interactivity needed |

**Client Components** (`'use client'` at the top):

| File | Why it needs the browser |
|---|---|
| `components/TasksView.tsx` | `useEffect` + `useState` to fetch tasks and handle auth redirect |
| `components/TaskDetailView.tsx` | `useEffect`, `useState`, `useRouter` for auth redirect and state machine |
| `components/HeaderAuth.tsx` | `useEffect`, `usePathname`, `useRouter` to show logged-in user |
| `app/tasks/error.tsx` | `useEffect` to log errors; `reset` is a callback prop |
| `app/login/page.tsx` | `useRouter`, `useSearchParams` for post-login redirect |

Example contrast — the page file is a Server Component, the view it renders is a Client Component:

```tsx
// app/tasks/page.tsx  — Server Component (no directive)
import { TasksView } from '@/components/TasksView'

export default function TasksPage() {
  return <TasksView />
}
```

```tsx
// components/TasksView.tsx  — Client Component
'use client'

import { useEffect, useState } from 'react'
import { getTasks } from '@/lib/api'
// ...
export function TasksView() {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  useEffect(() => { getTasks().then(res => setTasks(res.data)) }, [])
  // ...
}
```

The page shell is tiny and has no client JS. All the state and event handling is pushed to the leaf component that actually needs it.
