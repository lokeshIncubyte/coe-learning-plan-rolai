import { test, expect } from '@playwright/test'

// Day 7 — first pages: task list, task detail, not-found, shared layout nav.
// Mock API (e2e/mock-api/server.mjs) seeds 5 tasks across Alice/Bob/unassigned.
// Server Components fetch server-side from http://localhost:3001.

test.beforeEach(async ({ request, page }) => {
  // Restore pristine seeded state before each test.
  await request.post('http://localhost:3001/__test__/reset')
  // Day 10 added client-side auth gating: the task pages redirect to /login
  // unless a token is stored. Seed a valid token so these pre-auth flows run
  // as a signed-in user (the mock accepts any Bearer mock.jwt.* token).
  await page.addInitScript(() => {
    try {
      localStorage.setItem('access_token', 'mock.jwt.user')
    } catch {}
  })
})

// Story A — View the list of tasks
test('shows the Tasks page with a row per seeded task', async ({ page }) => {
  await page.goto('/tasks')

  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()

  // Each seeded task title is visible.
  await expect(page.getByText('Write project proposal')).toBeVisible()
  await expect(page.getByText('Review pull requests')).toBeVisible()
  await expect(page.getByText('Deploy to staging')).toBeVisible()
  await expect(page.getByText('Plan sprint')).toBeVisible()
  await expect(page.getByText('Fix login bug')).toBeVisible()

  // 5 seeded tasks => 5 rows.
  await expect(page.getByRole('listitem')).toHaveCount(5)

  // Status labels rendered for tasks (human-readable).
  await expect(page.getByText('In Progress').first()).toBeVisible()
  await expect(page.getByText('Done').first()).toBeVisible()
})

// Story C — Open a task's detail page
test('clicking a task navigates to its detail page with full details', async ({ page }) => {
  await page.goto('/tasks')

  await page.getByRole('link', { name: /Write project proposal/ }).click()

  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)

  // Title as the detail heading.
  await expect(
    page.getByRole('heading', { name: 'Write project proposal', level: 1 }),
  ).toBeVisible()
  // Full description.
  await expect(page.getByText('Draft the Q3 proposal')).toBeVisible()
  // Status badge.
  await expect(page.getByText('Open')).toBeVisible()
  // Timestamps.
  await expect(page.getByText(/^Created:/)).toBeVisible()
  await expect(page.getByText(/^Updated:/)).toBeVisible()
})

// Story D — Not-found state for an unknown task
test('shows a not-found page with a way back for an unknown task id', async ({ page }) => {
  await page.goto('/tasks/does-not-exist')

  await expect(
    page.getByRole('heading', { name: 'Task not found' }),
  ).toBeVisible()

  const backLink = page.getByRole('link', { name: 'Back to tasks' })
  await expect(backLink).toBeVisible()

  await backLink.click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()
})

// Story H — Navigate the app via the shared layout
test('shared header lets the user navigate home and to tasks from anywhere', async ({ page }) => {
  await page.goto('/')

  const header = page.getByRole('banner')
  await expect(header.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Tasks' })).toBeVisible()

  // Navigate to tasks via header.
  await header.getByRole('link', { name: 'Tasks' }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()

  // Header still present on the tasks page; navigate home.
  await page.getByRole('banner').getByRole('link', { name: 'Home' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Task Management' })).toBeVisible()
})

// Home page entry point links into the tasks list.
test('home page has a View Tasks link into the list', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Task Management' })).toBeVisible()

  await page.getByRole('link', { name: 'View Tasks' }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()
})
