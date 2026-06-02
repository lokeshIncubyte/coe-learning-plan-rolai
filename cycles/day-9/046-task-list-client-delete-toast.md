---
id: cycle-046
slug: task-list-client-delete-toast
status: pending
source: "Day 9 §5 'Toast notifications for ... delete success and failure' + user stories I, J"
covers: error-path
---
## Behavior
`TaskListClient` fires toast callbacks for delete outcomes. It accepts optional `onSuccess(message)` and `onError(message)` props. On a successful delete it calls `onSuccess('Task deleted')`; when `deleteTask` rejects it rolls back the optimistic removal (existing behavior) AND calls `onError("Couldn't delete the task. Please try again.")` so the page can surface an error toast. The deleted item leaves the list on success and is restored on failure (existing behavior preserved).

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskListClient.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskListClient } from './TaskListClient'
import type { Task } from '@/lib/api'

const tasks: Task[] = [
  { id: 'a', title: 'Alpha', description: null, status: 'OPEN', userId: null, createdAt: '', updatedAt: '' },
]

describe('TaskListClient delete toasts', () => {
  it('calls onSuccess after a successful delete', async () => {
    const onSuccess = vi.fn()
    render(<TaskListClient tasks={tasks} deleteTask={vi.fn().mockResolvedValue(undefined)} onSuccess={onSuccess} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onSuccess).toHaveBeenCalledWith('Task deleted')
  })

  it('calls onError and keeps the task when delete fails', async () => {
    const onError = vi.fn()
    render(<TaskListClient tasks={tasks} deleteTask={vi.fn().mockRejectedValue(new Error('boom'))} onError={onError} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onError).toHaveBeenCalledWith("Couldn't delete the task. Please try again.")
    expect(await screen.findByText('Alpha')).toBeInTheDocument()
  })
})
```
- Why it fails: `TaskListClient` has no `onSuccess`/`onError` props and never invokes such callbacks, so both `vi.fn()` mocks stay uncalled.

## GREEN
- Smallest change: add optional `onSuccess?: (m: string) => void` and `onError?: (m: string) => void` props; call `onSuccess?.('Task deleted')` after the awaited delete resolves, and `onError?.(...)` in the catch alongside the existing rollback.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskListClient.tsx

## REFACTOR
Keep the inline error `<p role="alert">` for now (still useful when no toast host is mounted), or remove it once a toast host is always present; defer that decision.
