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

// Story 7E — List loading skeleton while the GET /tasks request is in flight.
// TasksView is a client component that fetches via lib/api getTasks in the
// browser, so page.route can delay the GET and hold the skeleton open. The
// skeleton (TaskListSkeleton) is the role=status / aria-busy region; once the
// response resolves the task rows replace it.
test('shows the list loading skeleton while tasks load, then the rows', async ({ page }) => {
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  // Delay only the list API GET (the /tasks?... query on the API origin),
  // letting the request fire but holding the response until we release.
  await page.route(/localhost:3001\/tasks\?/, async (route) => {
    if (route.request().method() !== 'GET') return route.continue()
    await gate
    return route.continue()
  })

  await page.goto('/tasks')

  // While loading: the skeleton's status region is visible and marked busy;
  // no task rows yet.
  const skeleton = page.getByRole('status', { name: 'Loading tasks' })
  await expect(skeleton).toBeVisible()
  await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByRole('listitem')).toHaveCount(0)

  // Release the response: the skeleton goes away and the seeded rows appear.
  release()
  await expect(page.getByRole('listitem')).toHaveCount(5)
  await expect(skeleton).toBeHidden()
  await expect(page.getByText('Write project proposal')).toBeVisible()
})

// Story 7F — Detail loading state while the single-task GET is in flight.
// TaskDetailView fetches getTask(id) in the browser; while pending it renders
// a "Loading…" indicator, then swaps in the detail once resolved.
test('shows the detail loading indicator while a task loads, then the detail', async ({ page }) => {
  // Reach a real detail page by clicking a card from the list (seeded ids are
  // not stable across resets, so we don't hardcode one). The detail GET fires
  // client-side from TaskDetailView, so page.route can delay it.
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()

  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  // Delay only the single-task API GET (e.g. http://localhost:3001/tasks/task-0001).
  // Scope to the API origin so we never hold the Next page navigation
  // (served from :3002) which shares the /tasks/<id> path.
  await page.route('http://localhost:3001/tasks/*', async (route) => {
    if (route.request().method() !== 'GET') return route.continue()
    await gate
    return route.continue()
  })

  await page.getByRole('link', { name: /Write project proposal/ }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)

  // While loading: the "Loading…" indicator shows and the detail heading is not
  // yet present.
  await expect(page.getByText('Loading…')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(0)

  // Release: the indicator clears and the task detail renders.
  release()
  await expect(page.getByText('Loading…')).toBeHidden()
  await expect(page.getByRole('heading', { name: 'Write project proposal', level: 1 })).toBeVisible()
})

// Story 7G — List error state when the GET /tasks request fails.
// TasksView catches the fetch failure and renders an inline role=alert message.
// There is no in-page retry affordance on this client path (the route-level
// error.tsx "Try again" only handles render-time throws, which a caught fetch
// error does not trigger), so we assert the error message and that recovery is
// possible by reloading once the API succeeds again.
test('shows an error message when the task list fails to load, and recovers on reload', async ({
  page,
}) => {
  // Fail the list API GET on the first load.
  await page.route(/localhost:3001\/tasks\?/, async (route, request) => {
    if (request.method() !== 'GET') return route.continue()
    return route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'boom' }),
    })
  })

  await page.goto('/tasks')

  // Inline error alert is shown (scoped to the TasksView message, not the
  // Next route announcer which is also role=alert); no task rows render.
  const alert = page.getByRole('alert').filter({ hasText: /Failed to fetch tasks/i })
  await expect(alert).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(0)

  // Recovery: stop failing the request and reload — the list loads normally.
  await page.unroute(/localhost:3001\/tasks\?/)
  await page.reload()
  await expect(
    page.getByRole('alert').filter({ hasText: /Failed to fetch tasks/i }),
  ).toBeHidden()
  await expect(page.getByRole('listitem')).toHaveCount(5)
  await expect(page.getByText('Write project proposal')).toBeVisible()
})

// Home page entry point links into the tasks list.
test('home page has a View Tasks link into the list', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Task Management' })).toBeVisible()

  await page.getByRole('link', { name: 'View Tasks' }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()
})
