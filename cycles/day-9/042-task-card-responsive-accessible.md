---
id: cycle-042
slug: task-card-responsive-accessible
status: pending
source: "Day 9 §3/§4 'cards ... status badges' + user stories A, B, D"
covers: atomic
---
## Behavior
The `TaskCard` becomes a styled card: the linking element gets card utilities (block, full-width, rounded, border, padding) so cards stack in a single column and fill width on mobile and reflow inside a grid on desktop, with no fixed width that would overflow at 320px. The title text gets wrapping/break utilities so long titles wrap within the card rather than overflowing. The status badge remains rendered. The link exposes an accessible name that includes the task title.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskCard.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskCard } from './TaskCard'
import type { Task } from '@/lib/api'

const task: Task = {
  id: 't1',
  title: 'A very long task title that should wrap inside the card',
  description: null,
  status: 'IN_PROGRESS',
  userId: null,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
}

describe('TaskCard styling', () => {
  it('renders a full-width block card link with wrapping title and status', () => {
    render(<TaskCard task={task} />)
    const link = screen.getByRole('link', { name: /a very long task title/i })
    expect(link).toHaveAttribute('href', '/tasks/t1')
    expect(link.className).toMatch(/block/)
    expect(link.className).toMatch(/\bw-full\b/)
    expect(link.className).toMatch(/rounded/)
    expect(link.className).toMatch(/border/)
    const title = screen.getByText(/a very long task title/i)
    expect(title.className).toMatch(/break-words|truncate|break-all/)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })
})
```
- Why it fails: the current `TaskCard` Link and title span have no className, so `block`, `w-full`, `rounded`, `border`, and `break-words` are all absent.

## GREEN
- Smallest change: add `className` to the `<Link>` (`block w-full rounded-lg border p-4 ...` plus `dark:` variants) and to the title `<span>` (`break-words font-medium ...`). Keep `<StatusBadge>` as-is.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskCard.tsx

## REFACTOR
Consider a hover/focus style (`hover:`, `focus-visible:`) for visible focus rings; safe to add now or defer to the keyboard-focus pass.
