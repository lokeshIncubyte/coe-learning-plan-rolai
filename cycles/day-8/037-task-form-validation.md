---
id: cycle-037
slug: task-form-validation
status: done
source: "Checklist §3/§6: controlled inputs + client validation, required trimmed title (User Story B)"
covers: validation
---
## Behavior
`TaskForm` is a props-driven client component with controlled `title`, `description`, and a `status` select (OPEN/IN_PROGRESS/DONE). It takes an `onSubmit(values)` prop. When the user submits with an empty or whitespace-only title, the form does NOT call `onSubmit`, and renders an inline "Title is required" message. The status select defaults to OPEN.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskForm.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskForm } from './TaskForm'

describe('TaskForm validation', () => {
  it('blocks submit and shows an error when the title is blank', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} submitLabel="Create" />)

    await userEvent.type(screen.getByLabelText(/title/i), '   ')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with trimmed controlled values when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} submitLabel="Create" />)

    await userEvent.type(screen.getByLabelText(/title/i), '  Buy milk  ')
    await userEvent.type(screen.getByLabelText(/description/i), 'Full fat')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Buy milk', description: 'Full fat', status: 'OPEN' })
  })
})
```
- Why it fails: `components/TaskForm.tsx` does not exist.

## GREEN
- Smallest change: Create `'use client'` `TaskForm({ onSubmit, submitLabel, initialValues? })` with `useState` for title/description/status, a labelled title input, description input, status `<select>` defaulting to `initialValues?.status ?? 'OPEN'`, and a submit `<button>`. On submit `preventDefault`, compute `trimmed = title.trim()`; if empty set an error state and return; else call `onSubmit({ title: trimmed, description: description.trim(), status })`.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskForm.tsx

## REFACTOR
none
