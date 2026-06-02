---
id: cycle-044
slug: skeleton-card
status: done
source: "Day 9 §5 'Loading skeletons for the listing' + user story E"
covers: atomic
---
## Behavior
A new presentational `TaskListSkeleton` component renders a configurable number of placeholder cards shaped like real task cards (same grid container and card footprint) so the layout does not jump when skeletons swap to content. Each placeholder uses `animate-pulse` and a neutral background, is marked `aria-hidden` (decorative), and the container exposes an accessible loading status via `role="status"` / `aria-busy`. It defaults to a small fixed count when no `count` prop is given.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskListSkeleton.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskListSkeleton } from './TaskListSkeleton'

describe('TaskListSkeleton', () => {
  it('renders the requested number of pulsing placeholder cards inside a busy status region', () => {
    const { container } = render(<TaskListSkeleton count={4} />)
    const region = screen.getByRole('status')
    expect(region).toHaveAttribute('aria-busy', 'true')
    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses).toHaveLength(4)
  })

  it('renders a default number of placeholders when count is omitted', () => {
    const { container } = render(<TaskListSkeleton />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })
})
```
- Why it fails: `TaskListSkeleton` does not exist yet, so the import fails and both tests error.

## GREEN
- Smallest change: create `TaskListSkeleton.tsx` — a function component accepting `{ count = 3 }`, rendering a `role="status" aria-busy` container with a grid and `count` `aria-hidden` divs each carrying `animate-pulse rounded-lg` (and `dark:` background variants).
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskListSkeleton.tsx (new)

## REFACTOR
Reuse the same grid class string as `TaskList` (extract a shared constant) so skeleton and real list share an identical footprint; defer if it complicates imports.
