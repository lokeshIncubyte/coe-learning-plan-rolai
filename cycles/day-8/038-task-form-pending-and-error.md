---
id: cycle-038
slug: task-form-pending-and-error
status: pending
source: "Checklist §6: disable submit while pending; surface backend errors inline (User Stories G & F)"
covers: error-path
---
## Behavior
While an `onSubmit` promise is in flight, `TaskForm` disables the submit button and shows a pending label ("Saving…"), preventing double submits. If `onSubmit` rejects, the form stays populated with the typed values and renders the rejection's message as a visible error; the button returns to enabled afterwards.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskForm.test.tsx
- Assertion:
```ts
it('shows a pending state and surfaces a rejection message', async () => {
  let reject!: (e: Error) => void
  const onSubmit = vi.fn().mockReturnValue(new Promise<void>((_, r) => { reject = r }))
  render(<TaskForm onSubmit={onSubmit} submitLabel="Create" />)

  await userEvent.type(screen.getByLabelText(/title/i), 'Buy milk')
  await userEvent.click(screen.getByRole('button', { name: /create/i }))

  const pendingBtn = screen.getByRole('button', { name: /saving/i })
  expect(pendingBtn).toBeDisabled()

  reject(new Error('title should not be empty'))
  expect(await screen.findByText(/title should not be empty/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /create/i })).toBeEnabled()
  expect(screen.getByLabelText(/title/i)).toHaveValue('Buy milk')
})
```
- Why it fails: After cycle-037 `TaskForm` calls `onSubmit` but does not track a pending flag (no "Saving…"/disabled) and does not catch rejections to display their message.

## GREEN
- Smallest change: Add `pending` and `error` state. In the submit handler set `pending=true`, wrap `await onSubmit(...)` in try/catch; on catch set `error = e.message`; in `finally` set `pending=false`. Button uses `disabled={pending}` and renders `pending ? 'Saving…' : submitLabel`; render `error` when present.
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskForm.tsx

## REFACTOR
none
