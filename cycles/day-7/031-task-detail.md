---
id: cycle-031
slug: task-detail
status: pending
source: "§5 Render full task details (title, description, status, timestamps) (user story C)"
covers: happy-path
---

## Behavior
`TaskDetail` is a props-driven presentational component that takes a `task: Task` and renders the full detail view: the title as a heading, the description text, the status (via `StatusBadge`), and the created/updated timestamps in a readable form. This is the body of the `/tasks/[id]` detail page, kept presentational so it is unit-testable.

## RED
- Test file: `/home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskDetail.test.tsx`
- Assertion:
  ```ts
  import { render, screen } from '@testing-library/react'
  import { describe, it, expect } from 'vitest'
  import { TaskDetail } from './TaskDetail'
  import type { Task } from '@/lib/api'

  const task: Task = {
    id: 'task-0001',
    title: 'Write project proposal',
    description: 'Draft the Q3 proposal',
    status: 'DONE',
    userId: null,
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
  }

  describe('TaskDetail', () => {
    it('renders title, description, status and timestamps', () => {
      render(<TaskDetail task={task} />)
      expect(screen.getByRole('heading', { name: 'Write project proposal' })).toBeInTheDocument()
      expect(screen.getByText('Draft the Q3 proposal')).toBeInTheDocument()
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.getByText(/Created/i)).toBeInTheDocument()
      expect(screen.getByText(/Updated/i)).toBeInTheDocument()
    })
  })
  ```
- Why it fails: `components/TaskDetail.tsx` does not exist, so the import is unresolved and the render throws.

## GREEN
- Smallest change: Create `components/TaskDetail.tsx` exporting `TaskDetail({ task }: { task: Task })` rendering an `<h1>{task.title}</h1>`, a `<StatusBadge status={task.status} />`, a `<p>{task.description}</p>`, and two lines labelled "Created" and "Updated" showing the respective timestamps (e.g. `new Date(task.createdAt).toLocaleString()`).
- Files touched: `components/TaskDetail.tsx`

## REFACTOR
Extract a tiny `formatDate` helper if both timestamp lines duplicate formatting logic.
