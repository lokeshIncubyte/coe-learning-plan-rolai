# 12. Responsive Design with Tailwind Breakpoints

## What it is

Tailwind uses a **mobile-first breakpoint system**. A utility with no prefix applies at every screen size. A prefixed utility like `sm:grid-cols-2` applies only at the `sm` breakpoint and above (640 px by default), overriding the mobile value.

The three you'll use most:

| Prefix | Applies from |
|--------|-------------|
| `sm:`  | 640 px      |
| `md:`  | 768 px      |
| `lg:`  | 1024 px     |

Mobile-first means you think smallest-screen first, then progressively enhance rather than progressively collapse.

## How responsive classes compose

```
grid-cols-1      ← all screens (mobile base)
sm:grid-cols-2   ← 640px and wider
lg:grid-cols-3   ← 1024px and wider
```

Each prefix is a plain CSS `min-width` media query. There is no magic — Tailwind just generates the right `@media` rule for each prefixed class.

## How it's used in this project

**Task grid** — `components/TaskList.tsx` exports a shared grid class used by both the live list and its loading skeleton:

```tsx
// components/TaskList.tsx
export const TASK_GRID_CLASS = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
```

At 320 px (mobile) the tasks stack in a single column. At 640 px they form a two-column grid. At 1024 px a three-column grid. The layout is defined in one string with no media-query boilerplate.

**Skeleton reuses the same token** — `components/TaskListSkeleton.tsx` imports `TASK_GRID_CLASS` directly, so the loading skeleton and the real list are always responsive in exactly the same way:

```tsx
// components/TaskListSkeleton.tsx
import { TASK_GRID_CLASS } from './TaskList'

export function TaskListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div role="status" aria-busy="true" aria-label="Loading tasks" className={TASK_GRID_CLASS}>
      {/* … */}
    </div>
  )
}
```

Sharing the class constant is a small but deliberate choice: if the grid ever changes (say, adding an `xl:grid-cols-4` column), both the real list and the skeleton update together.

**Empty state** — when there are no tasks, `TaskList` renders a centered call-to-action that works at any width because it uses flexbox rather than fixed pixel widths:

```tsx
<div className="flex flex-col items-center gap-4 rounded-lg border border-dashed
                border-gray-300 p-12 text-center">
```

## Key insight

Mobile-first is the default; every unprefixed class is your mobile style. Resist the temptation to define a desktop layout first and then shrink it — build upward from the smallest meaningful layout and add complexity only where the wider screen can use it.
