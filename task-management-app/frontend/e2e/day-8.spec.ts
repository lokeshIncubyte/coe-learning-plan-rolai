import { test, expect } from '@playwright/test'

// Day 8 — interactive CRUD: create / edit / delete via forms and client components.
// Mock API (e2e/mock-api/server.mjs) seeds 5 tasks. These tests mutate that
// in-memory state, so they run serially and reset to pristine seed each time.
//
// Implemented this day (verified against app/ + components/):
//   - /tasks/new          -> NewTaskForm (create, client validation, pending, error)
//   - /tasks/[id]/edit     -> EditTaskForm (pre-filled, save, error surfaced)
//   - /tasks/[id]          -> DeleteTaskControl (confirm/cancel delete)
//
// NOT wired into any page this day, so NOT covered as a user flow:
//   - Story E (optimistic delete + rollback in the LIST): TaskListClient exists
//     but the list page renders the non-interactive TaskList. No user-reachable
//     optimistic-delete-in-list flow exists, so it is omitted.

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ request }) => {
  await request.post('http://localhost:3001/__test__/reset')
})

// Story A — Add a new task via a form (happy path)
test('creates a task via the form and it appears in the list (persists on refresh)', async ({
  page,
}) => {
  await page.goto('/tasks')

  await page.getByRole('link', { name: 'New task' }).click()
  await expect(page).toHaveURL(/\/tasks\/new$/)
  await expect(page.getByRole('heading', { name: 'New task' })).toBeVisible()

  await page.getByLabel('Title').fill('Buy milk')
  await page.getByLabel('Description').fill('Full fat')
  // Status left as OPEN (default).
  await page.getByRole('button', { name: 'Create task' }).click()

  // Redirected to the new task's detail view.
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  await expect(page.getByRole('heading', { name: 'Buy milk', level: 1 })).toBeVisible()
  await expect(page.getByText('Full fat')).toBeVisible()
  await expect(page.getByText('Open')).toBeVisible()

  // The new task now appears in the list, and is still there after a refresh.
  await page.goto('/tasks')
  await expect(page.getByText('Buy milk')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Buy milk')).toBeVisible()
})

// Story B — Client-side validation blocks an empty title
test('blocks submission of an empty title with an inline message and no request', async ({
  page,
}) => {
  await page.goto('/tasks/new')

  // Capture any POST /tasks request to prove none is sent.
  let posted = false
  await page.route('**/tasks', (route) => {
    if (route.request().method() === 'POST') posted = true
    return route.continue()
  })

  // Leave title empty (only spaces) and submit.
  await page.getByLabel('Title').fill('   ')
  await page.getByRole('button', { name: 'Create task' }).click()

  await expect(page.getByText('Title is required')).toBeVisible()
  // Still on the form; the submit button is available to retry.
  await expect(page).toHaveURL(/\/tasks\/new$/)
  await expect(page.getByRole('button', { name: 'Create task' })).toBeEnabled()
  expect(posted).toBe(false)
})

// Story C — Edit an existing task
test('edits a task via a pre-filled form and the change persists', async ({ page }) => {
  // Create a known task to edit.
  await page.goto('/tasks/new')
  await page.getByLabel('Title').fill('Buy milk')
  await page.getByLabel('Description').fill('Full fat')
  await page.getByRole('button', { name: 'Create task' }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  const detailUrl = page.url()

  // Open the edit form.
  await page.getByRole('link', { name: 'Edit' }).click()
  await expect(page).toHaveURL(/\/edit$/)

  // Form is pre-filled with current values.
  await expect(page.getByLabel('Title')).toHaveValue('Buy milk')
  await expect(page.getByLabel('Description')).toHaveValue('Full fat')
  await expect(page.getByLabel('Status')).toHaveValue('OPEN')

  // Change only the title and save.
  await page.getByLabel('Title').fill('Buy oat milk')
  await page.getByRole('button', { name: 'Save changes' }).click()

  // Back on the detail view with the updated title; other fields unchanged.
  await expect(page).toHaveURL(detailUrl)
  await expect(page.getByRole('heading', { name: 'Buy oat milk', level: 1 })).toBeVisible()
  await expect(page.getByText('Full fat')).toBeVisible()
  await expect(page.getByText('Open')).toBeVisible()

  // Persists after refresh.
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Buy oat milk', level: 1 })).toBeVisible()
})

// Story D — Delete a task with a confirmation step (on the detail page)
test('confirmation step: Cancel keeps the task, Confirm deletes it', async ({ page }) => {
  await page.goto('/tasks')
  await page.getByRole('link', { name: /Write project proposal/ }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)

  // First click reveals the confirmation prompt; Cancel keeps the task.
  await page.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText('Delete this task?')).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()
  await expect(page.getByText('Delete this task?')).toBeHidden()
  await expect(page.getByRole('heading', { name: 'Write project proposal', level: 1 })).toBeVisible()

  // Confirm this time -> deleted, returned to the list, task gone.
  await page.getByRole('button', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByText('Write project proposal')).toBeHidden()

  // Still gone after a refresh.
  await page.reload()
  await expect(page.getByText('Write project proposal')).toBeHidden()
})

// Story G — Submit button shows a pending state and prevents double-submit
test('submit button shows a pending state while the request is in flight', async ({ page }) => {
  await page.goto('/tasks/new')

  // Delay the POST so we can observe the pending state.
  await page.route('**/tasks', async (route) => {
    if (route.request().method() === 'POST') {
      await new Promise((r) => setTimeout(r, 1000))
    }
    return route.continue()
  })

  await page.getByLabel('Title').fill('Slow task')

  const submit = page.getByRole('button', { name: 'Create task' })
  await submit.click()

  // While in flight: button is disabled and labelled "Saving…".
  const pending = page.getByRole('button', { name: 'Saving…' })
  await expect(pending).toBeVisible()
  await expect(pending).toBeDisabled()

  // Eventually completes and navigates away.
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
})

// Story F — Graceful error when a submit fails (server unreachable)
test('shows an error and keeps typed values when the create request fails', async ({ page }) => {
  await page.goto('/tasks/new')

  // Make the POST fail (server unreachable).
  await page.route('**/tasks', (route) => {
    if (route.request().method() === 'POST') return route.abort()
    return route.continue()
  })

  await page.getByLabel('Title').fill('Will fail')
  await page.getByLabel('Description').fill('keep me')
  await page.getByRole('button', { name: 'Create task' }).click()

  // Still on the form, values preserved, an error is surfaced, button usable again.
  await expect(page).toHaveURL(/\/tasks\/new$/)
  await expect(page.getByLabel('Title')).toHaveValue('Will fail')
  await expect(page.getByLabel('Description')).toHaveValue('keep me')
  await expect(page.getByRole('button', { name: 'Create task' })).toBeEnabled()
  // An error message is shown (never silently swallowed).
  await expect(page.locator('form p')).toBeVisible()
})

// Story H — Editing a task that no longer exists (404 path)
// The app surfaces the backend's not-found message inline rather than a
// custom friendly string; we assert the user gets feedback and stays on the
// form (not a dead/blank page).
test('surfaces a not-found error when saving an edit for a deleted task', async ({
  page,
  request,
}) => {
  // Open the edit form for a real seeded task.
  await page.goto('/tasks')
  await page.getByRole('link', { name: /Plan sprint/ }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  const id = page.url().split('/').pop()!
  await page.getByRole('link', { name: 'Edit' }).click()
  await expect(page).toHaveURL(/\/edit$/)

  // Delete the task out from under the form via the API.
  await request.delete(`http://localhost:3001/tasks/${id}`)

  // Change a field and save -> backend 404.
  await page.getByLabel('Title').fill('Plan the sprint better')
  await page.getByRole('button', { name: 'Save changes' }).click()

  // Stays on the edit form and shows a feedback message (not found).
  await expect(page).toHaveURL(/\/edit$/)
  await expect(page.getByText(/not found/i)).toBeVisible()
  // A way back to the task is still offered.
  await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible()
})
