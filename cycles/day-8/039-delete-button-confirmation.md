---
id: cycle-039
slug: delete-button-confirmation
status: pending
source: "Checklist §5: confirmation step before delete; Cancel keeps the task (User Story D)"
covers: validation
---
## Behavior
`DeleteTaskButton` is a props-driven client component taking `onConfirm()`. Clicking "Delete" reveals an inline confirmation ("Delete this task?" with Confirm/Cancel) instead of deleting immediately. Clicking Cancel hides the confirmation and never calls `onConfirm`. Clicking Confirm calls `onConfirm` exactly once.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/DeleteTaskButton.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DeleteTaskButton } from './DeleteTaskButton'

describe('DeleteTaskButton', () => {
  it('requires confirmation and does not call onConfirm when cancelled', async () => {
    const onConfirm = vi.fn()
    render(<DeleteTaskButton onConfirm={onConfirm} />)

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(screen.getByText(/delete this task\?/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByText(/delete this task\?/i)).not.toBeInTheDocument()
  })

  it('calls onConfirm once when confirmed', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(<DeleteTaskButton onConfirm={onConfirm} />)

    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
```
- Why it fails: `components/DeleteTaskButton.tsx` does not exist.

## GREEN
- Smallest change: Create `'use client'` `DeleteTaskButton({ onConfirm })` with `confirming` state. Initially a "Delete" button that sets `confirming=true`. When confirming, render the prompt text plus "Confirm" (calls `onConfirm()`) and "Cancel" (sets `confirming=false`) buttons.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/DeleteTaskButton.tsx

## REFACTOR
none
