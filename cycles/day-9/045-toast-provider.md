---
id: cycle-045
slug: toast-provider
status: done
source: "Day 9 §5 'Toast notifications for create/update/delete success and failure' + user stories G, H, I, J"
covers: atomic
---
## Behavior
A small custom toast system: a `ToastProvider` client component supplies a `useToast()` hook returning `toast.success(msg)` and `toast.error(msg)`. Calling either pushes a toast that renders in a live region (`role="status"` for success, `role="alert"` for error) with appropriate color styling. Toasts are dismissible via a close button (an icon-only button with an `aria-label`) and auto-dismiss after a timeout. This cycle proves the provider/hook contract and rendering; wiring into forms/delete happens in their own cycles via the success/error callbacks already plumbed through the components.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/ToastProvider.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ToastProvider, useToast } from './ToastProvider'

function Trigger() {
  const toast = useToast()
  return (
    <div>
      <button onClick={() => toast.success('Task created')}>ok</button>
      <button onClick={() => toast.error("Couldn't save task")}>fail</button>
    </div>
  )
}

describe('ToastProvider', () => {
  it('shows a success toast in a status region and can dismiss it', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'ok' }))
    const toast = screen.getByText('Task created')
    expect(toast).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Task created')

    await userEvent.click(screen.getByRole('button', { name: /dismiss|close/i }))
    expect(screen.queryByText('Task created')).not.toBeInTheDocument()
  })

  it('shows a failure toast in an alert region', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'fail' }))
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't save task")
  })
})
```
- Why it fails: `ToastProvider` and `useToast` do not exist yet, so the import fails.

## GREEN
- Smallest change: create `ToastProvider.tsx` ('use client') with a React context holding a toast list, `addToast(message, variant)`, and an auto-dismiss `setTimeout`. Render a fixed-position stack; each toast is a div with `role` `status`/`alert`, variant color classes, and an icon-only dismiss button with `aria-label="Dismiss notification"`. Export `useToast()` returning `{ success, error }`.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/ToastProvider.tsx (new)

## REFACTOR
Make auto-dismiss timeout a constant; ensure timers are cleared on unmount to avoid test leakage.
