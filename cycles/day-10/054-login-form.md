---
id: cycle-054
slug: login-form
status: pending
source: "Day 10 checklist §4: login form (Client Component); user stories H & I"
covers: validation
---
## Behavior
A props-driven `LoginForm` Client Component renders controlled email + password inputs and a "Sign in" button. On submit it calls an injected `onSubmit(email, password)` callback. When the callback rejects, the form stays put and shows the error message in a `role="alert"` region (story I). The button is disabled while the submit is pending. Keeping submission behind an injected callback keeps the network/storage/redirect side effects out of the unit and lets the page wire them up.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/LoginForm.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('submits the typed email and password to onSubmit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'S3cret!pw')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledWith('alice@example.com', 'S3cret!pw')
  })

  it('shows an inline error and does not clear the form when onSubmit rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Invalid email or password'))
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i)
    expect(screen.getByLabelText(/email/i)).toHaveValue('alice@example.com')
  })
})
```
- Why it fails: `components/LoginForm.tsx` does not exist, so the import cannot resolve.

## GREEN
- Smallest change: Create `components/LoginForm.tsx` (`'use client'`) with `useState` for email/password/error/pending, a `<form>` with labelled `email` and `password` inputs, and a "Sign in" submit button. On submit: `preventDefault`, set pending, `await onSubmit(email, password)`, catch → `setError(message)` in a `<p role="alert">`. Props: `{ onSubmit: (email: string, password: string) => void | Promise<void> }`.
- Files touched: components/LoginForm.tsx

## REFACTOR
Share field/label class strings with TaskForm if convenient. none required.
