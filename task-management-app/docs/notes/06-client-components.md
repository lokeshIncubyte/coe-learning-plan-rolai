# 6. Client Components and the `'use client'` directive

## What it is

In Next.js App Router every file is a **Server Component by default**. Server Components run only on the server — they can `await` data, read environment variables, and never ship their own JavaScript bundle to the browser. The trade-off is that they cannot use browser APIs, event handlers, or React hooks like `useState` and `useEffect`.

Adding `'use client'` at the very top of a file marks that module (and everything it imports that isn't already a Server Component) as a **Client Component**. Client Components are still server-rendered on the first request (so the HTML arrives pre-built), but their JavaScript is also sent to the browser so React can re-render them interactively.

## The rule of thumb

Ask: *does this component need interactivity or browser-only APIs?*

- Needs `useState`, `useEffect`, `useRouter`, event handlers → **Client Component**
- Only renders data it received as props → can stay a **Server Component**

Push `'use client'` as deep in the tree as possible. Keep the outer shell (the page or layout) a Server Component that fetches data; let the interactive leaf nodes opt in to the client.

## How it is used in this project

Every interactive component carries the directive on line 1.

`components/TaskForm.tsx` — the shared form primitive:
```tsx
'use client'

import { useState } from 'react'
// uses useState for title, description, status, error, pending
```

`components/DeleteTaskButton.tsx` — two-step confirmation:
```tsx
'use client'

import { useState } from 'react'
// useState drives the confirming/idle toggle
```

`components/TaskListClient.tsx` — the list that owns optimistic state:
```tsx
'use client'

import { useState } from 'react'
import type { Task } from '@/lib/api'
```

`components/NewTaskView.tsx` and `EditTaskView.tsx` are also `'use client'` because they call `useRouter` and `useEffect` for the auth-redirect guard.

The page files themselves (`app/tasks/new/page.tsx`, `app/tasks/[id]/edit/page.tsx`) contain **no** `'use client'` — they are Server Components that simply render the Client Component views. This keeps the boundary explicit and narrow.
