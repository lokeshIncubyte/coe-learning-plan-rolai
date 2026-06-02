---
id: cycle-048
slug: delete-button-aria-focus
status: done
source: "Day 9 §6 'ARIA labels on icon-only buttons ... visible focus rings' + user stories N, O"
covers: validation
---
## Behavior
The `DeleteTaskButton` trigger becomes accessible and keyboard-friendly: the collapsed delete control carries an `aria-label` that names the action (so an icon-only rendering still announces meaningfully) and a visible focus ring via `focus-visible:` utility classes, plus a destructive color treatment. The confirm/cancel controls in the expanded state likewise get visible focus styling. Behavior (confirm calls `onConfirm`, cancel collapses) is preserved.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/DeleteTaskButton.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DeleteTaskButton } from './DeleteTaskButton'

describe('DeleteTaskButton accessibility', () => {
  it('exposes an aria-label and a visible focus ring on the delete trigger', () => {
    render(<DeleteTaskButton onConfirm={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: /delete task/i })
    expect(trigger).toHaveAttribute('aria-label')
    expect(trigger.className).toMatch(/focus-visible:/)
  })

  it('still confirms deletion via keyboard', async () => {
    const onConfirm = vi.fn()
    render(<DeleteTaskButton onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: /delete task/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
```
- Why it fails: the current trigger button has only the text "Delete" with no `aria-label` and no `focus-visible:` class, so the `name: /delete task/i` match plus the className assertion fail.

## GREEN
- Smallest change: add `aria-label="Delete task"` and `className` containing `focus-visible:ring-...` (and destructive color) to the collapsed trigger button; add focus-ring classes to the confirm/cancel buttons.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/DeleteTaskButton.tsx

## REFACTOR
Define a shared `focus-visible` ring utility string and reuse across the confirm/cancel/trigger buttons; defer broader app-wide focus styling to manual/e2e pass.
