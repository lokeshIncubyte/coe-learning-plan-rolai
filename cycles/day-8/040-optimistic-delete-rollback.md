---
id: cycle-040
slug: optimistic-delete-rollback
status: pending
source: "Checklist §6: optimistic delete removes row immediately, rolls back on failure (User Story E)"
covers: error-path
---
## Behavior
`TaskListClient` is a props-driven client component rendering an interactive list from an initial `tasks` prop and a `deleteTask(id)` prop. Confirming a delete removes the row from the visible list immediately (optimistic), before the promise resolves. If `deleteTask` rejects, the removed row reappears in its original position and a "Couldn't delete the task. Please try again." error message is shown.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskListClient.test.tsx
- Assertion:
```ts
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskListClient } from './TaskListClient'
import type { Task } from '@/lib/api'

const tasks: Task[] = [
  { id: 't1', title: 'Buy milk', description: null, status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' },
  { id: 't2', title: 'Walk dog', description: null, status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' },
]

describe('TaskListClient optimistic delete', () => {
  it('removes the row immediately then rolls back on failure', async () => {
    let reject!: (e: Error) => void
    const deleteTask = vi.fn().mockReturnValue(new Promise<void>((_, r) => { reject = r }))
    render(<TaskListClient tasks={tasks} deleteTask={deleteTask} />)

    const milkRow = screen.getByText('Buy milk').closest('li')!
    await userEvent.click(within(milkRow).getByRole('button', { name: /^delete$/i }))
    await userEvent.click(within(milkRow).getByRole('button', { name: /confirm/i }))

    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument()
    expect(screen.getByText('Walk dog')).toBeInTheDocument()

    reject(new Error('network'))
    expect(await screen.findByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByText(/couldn't delete the task/i)).toBeInTheDocument()
  })
})
```
- Why it fails: `components/TaskListClient.tsx` does not exist.

## GREEN
- Smallest change: Create `'use client'` `TaskListClient({ tasks, deleteTask })` holding `items` in `useState(tasks)` and an `error` state. Render each item in an `<li>` with the title and a `DeleteTaskButton` whose `onConfirm` removes that item from `items` optimistically, then `await deleteTask(id)`; on rejection restore the saved previous `items` and set the rollback error message.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskListClient.tsx

## REFACTOR
Reuse `TaskCard`/`StatusBadge` for row content once behaviour is green; keep markup minimal during GREEN.
