---
id: cycle-043
slug: task-list-grid-empty-state
status: pending
source: "Day 9 §4 'multi-column grid' + §5 'empty states styled' + user stories B, F"
covers: atomic
---
## Behavior
`TaskList` lays its cards out in a responsive grid: a single column on mobile that grows to multiple columns at the `sm`/`lg` breakpoints (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), with consistent gap spacing. When there are no tasks, it renders a styled empty state: a friendly heading plus a call-to-action link to create the first task (`/tasks/new`), rather than the bare "No tasks yet" paragraph.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskList.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskList } from './TaskList'
import type { Task } from '@/lib/api'

const tasks: Task[] = [
  { id: 'a', title: 'One', description: null, status: 'OPEN', userId: null, createdAt: '', updatedAt: '' },
  { id: 'b', title: 'Two', description: null, status: 'DONE', userId: null, createdAt: '', updatedAt: '' },
]

describe('TaskList layout and empty state', () => {
  it('renders cards in a responsive multi-column grid', () => {
    const { container } = render(<TaskList tasks={tasks} />)
    const grid = container.querySelector('ul')!
    expect(grid.className).toMatch(/\bgrid\b/)
    expect(grid.className).toMatch(/grid-cols-1/)
    expect(grid.className).toMatch(/sm:grid-cols-2|lg:grid-cols-/)
    expect(grid.className).toMatch(/gap-/)
  })

  it('shows a friendly empty state with a create call-to-action when there are no tasks', () => {
    render(<TaskList tasks={[]} />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /create|new|first task/i })
    expect(cta).toHaveAttribute('href', '/tasks/new')
  })
})
```
- Why it fails: the current `<ul>` has no className (no grid classes) and the empty branch is a plain `<p>No tasks yet</p>` with no create link.

## GREEN
- Smallest change: add grid classes to the `<ul>`; replace the empty-state `<p>` with a styled block containing a heading and a `next/link` to `/tasks/new`.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskList.tsx

## REFACTOR
Extract the empty state into its own small presentational component if it grows; otherwise none.
