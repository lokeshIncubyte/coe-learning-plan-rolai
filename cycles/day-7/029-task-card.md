---
id: cycle-029
slug: task-card
status: done
source: "§4 Each task links to /tasks/[id]; user story A/C"
covers: atomic
---

## Behavior
`TaskCard` is a props-driven presentational component that takes a `task: Task` and renders the task title, its status (via `StatusBadge`), and wraps the row in a Next `Link` whose `href` is `/tasks/${task.id}`. This is the clickable list row that navigates to the detail page.

## RED
- Test file: `/home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskCard.test.tsx`
- Assertion:
  ```ts
  import { render, screen } from '@testing-library/react'
  import { describe, it, expect } from 'vitest'
  import { TaskCard } from './TaskCard'
  import type { Task } from '@/lib/api'

  const task: Task = {
    id: 'task-0001',
    title: 'Write project proposal',
    description: 'Draft the Q3 proposal',
    status: 'IN_PROGRESS',
    userId: null,
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
  }

  describe('TaskCard', () => {
    it('shows the title and status and links to the detail page', () => {
      render(<TaskCard task={task} />)
      expect(screen.getByText('Write project proposal')).toBeInTheDocument()
      expect(screen.getByText('In Progress')).toBeInTheDocument()
      const link = screen.getByRole('link', { name: /Write project proposal/i })
      expect(link).toHaveAttribute('href', '/tasks/task-0001')
    })
  })
  ```
- Why it fails: `components/TaskCard.tsx` does not exist, so the import is unresolved and the render throws.

## GREEN
- Smallest change: Create `components/TaskCard.tsx` exporting `TaskCard({ task }: { task: Task })` that returns a `<Link href={`/tasks/${task.id}`}>` containing the title text and a `<StatusBadge status={task.status} />`. Import `Link` from `next/link`, `Task` from `@/lib/api`, and `StatusBadge` from `./StatusBadge`.
- Files touched: `components/TaskCard.tsx`

## REFACTOR
none
