import { test, expect } from '@playwright/test'

// Day 9 — Styling & UX with Tailwind: responsive layout, color-coded status
// badges, loading skeletons, friendly empty state, toast notifications
// (create/update/delete/error), pending button state, dark-mode toggle that
// persists, and accessibility (aria-labels, associated form labels).
//
// Implemented this day (verified against app/ + components/):
//   - TaskList responsive grid (single col on mobile, multi-col >= lg) + empty state
//   - StatusBadge (Open / In Progress / Done) on cards and detail
//   - app/tasks/loading.tsx -> TaskListSkeleton (role=status, aria-busy)
//   - ToastProvider success/error toasts wired into New/Edit/Delete flows, auto-dismiss + close button
//   - TaskForm pending "Saving…" disabled button
//   - SiteHeader nav (Home / Tasks) + ThemeToggle (aria-label, persists via localStorage)
//
// Story C — Navigation usable on small screens: below the `sm` breakpoint the
//   primary nav links collapse behind an accessible menu toggle (button with
//   aria-label + aria-expanded) that reveals them; at >= sm they show inline
//   without a toggle. Covered by the two Story C tests below.
//
// Tests that mutate the shared in-memory mock run serially and reset state.

test.describe.configure({ mode: 'serial' })

test.beforeEach(async ({ request, page }) => {
  await request.post('http://localhost:3001/__test__/reset')
  // Day 10 added client-side auth gating: task pages redirect to /login unless
  // a token is stored. Seed a valid token so these styling/UX flows run
  // signed-in (the mock accepts any Bearer mock.jwt.* token).
  await page.addInitScript(() => {
    try {
      localStorage.setItem('access_token', 'mock.jwt.user')
    } catch {}
  })
})

// Story D — Color-coded status badges (seeded tasks span all three statuses)
test('shows a labeled status badge for each seeded task on the list', async ({ page }) => {
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()

  // Seed has OPEN, IN_PROGRESS and DONE tasks; each renders its labeled badge.
  await expect(page.getByText('Open').first()).toBeVisible()
  await expect(page.getByText('In Progress').first()).toBeVisible()
  await expect(page.getByText('Done').first()).toBeVisible()

  // The badge text reflects the actual status: the DONE task card shows "Done".
  const doneCard = page.getByRole('link', { name: /Deploy to staging/ })
  await expect(doneCard.getByText('Done')).toBeVisible()
})

// Story D (detail) — the detail page also surfaces the status as readable text
test('detail page shows the task status as a readable badge', async ({ page }) => {
  await page.goto('/tasks')
  await page.getByRole('link', { name: /Review pull requests/ }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  await expect(
    page.getByRole('heading', { name: 'Review pull requests', level: 1 }),
  ).toBeVisible()
  // Seeded as IN_PROGRESS -> badge reads "In Progress".
  await expect(page.getByText('In Progress')).toBeVisible()
})

// Story A — Responsive listing on mobile: single column, no horizontal scroll
test('listing fits a 320px mobile viewport without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()

  // No sideways scrolling: content width does not exceed the viewport.
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)

  // Cards stack in a single column: two cards share the same left edge (x).
  const cards = page.getByRole('link', { name: /Write project proposal|Review pull requests/ })
  const first = await cards.nth(0).boundingBox()
  const second = await cards.nth(1).boundingBox()
  expect(first).not.toBeNull()
  expect(second).not.toBeNull()
  expect(Math.abs(first!.x - second!.x)).toBeLessThan(2)
  // Stacked vertically, not side by side.
  expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1)
})

// Story B — Responsive listing on desktop: multi-column grid, same content
test('listing uses a multi-column grid at desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()

  // Two of the first cards sit on the same row (same y), different columns (different x).
  const a = await page.getByRole('link', { name: /Write project proposal/ }).boundingBox()
  const b = await page.getByRole('link', { name: /Review pull requests/ }).boundingBox()
  expect(a).not.toBeNull()
  expect(b).not.toBeNull()
  expect(Math.abs(a!.y - b!.y)).toBeLessThan(2)
  expect(b!.x).toBeGreaterThan(a!.x + a!.width - 1)
})

// Story C — On a narrow screen the nav collapses behind a menu toggle that
// reveals the links; activating a link navigates.
test('mobile nav collapses behind a menu toggle that reveals working links', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/tasks')

  const nav = page.getByRole('navigation', { name: 'Primary' })
  const toggle = page.getByRole('button', { name: 'Toggle navigation menu' })

  // The toggle is the visible control; the links are collapsed (hidden) initially.
  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(nav.getByRole('link', { name: 'Home' })).toBeHidden()
  await expect(nav.getByRole('link', { name: 'Tasks' })).toBeHidden()

  // Activating the toggle reveals the links and reports the expanded state.
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible()
  const tasksLink = nav.getByRole('link', { name: 'Tasks' })
  await expect(tasksLink).toBeVisible()

  // The revealed link navigates.
  await tasksLink.click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()
})

// Story C (desktop) — at >= sm the links show inline with no menu toggle.
test('desktop nav shows links inline without a menu toggle', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/tasks')

  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Tasks' })).toBeVisible()
  // The collapse toggle is hidden at desktop width.
  await expect(page.getByRole('button', { name: 'Toggle navigation menu' })).toBeHidden()

  // Links work inline.
  await nav.getByRole('link', { name: 'Home' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Task Management', level: 1 })).toBeVisible()
})

// Story F — Friendly empty state when there are no tasks
test('shows a friendly empty state with a CTA when there are no tasks', async ({ page }) => {
  // Delete every seeded task via the API so the list is empty.
  const res = await page.request.get('http://localhost:3001/tasks?limit=100')
  const { data } = await res.json()
  for (const t of data) {
    await page.request.delete(`http://localhost:3001/tasks/${t.id}`)
  }

  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'No tasks yet' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Create your first task' })).toBeVisible()
  // No task cards remain.
  await expect(page.getByText('Write project proposal')).toBeHidden()

  // The CTA leads to the create form.
  await page.getByRole('link', { name: 'Create your first task' }).click()
  await expect(page).toHaveURL(/\/tasks\/new$/)
})

// Story E — Loading skeletons while data loads.
// NOTE: loading.tsx (TaskListSkeleton) IS implemented and wired, but the
// /tasks page fetches its data SERVER-SIDE (getTasks runs on the Next server).
// Playwright's page.route cannot intercept/delay a server-side fetch, and the
// route-segment fallback is flushed too fast to catch deterministically from
// the browser. There is no reliable user-observable way to hold the skeleton
// open from an e2e test, so this scenario is intentionally omitted here. The
// skeleton's rendering is covered by the TaskListSkeleton unit test.

// Story G — Toast on successful task create
test('shows a success toast after creating a task', async ({ page }) => {
  await page.goto('/tasks/new')
  await page.getByLabel('Title').fill('Buy milk')
  await page.getByRole('button', { name: 'Create task' }).click()

  // Success toast (role=status) appears with confirmation text.
  await expect(page.getByText('Task created')).toBeVisible()
  // New task is reflected in the app.
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  await expect(page.getByRole('heading', { name: 'Buy milk', level: 1 })).toBeVisible()
})

// Story H — Toast on successful task update
test('shows a success toast after editing a task and reflects the change', async ({ page }) => {
  await page.goto('/tasks')
  await page.getByRole('link', { name: /Plan sprint/ }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  await page.getByRole('link', { name: 'Edit' }).click()
  await expect(page).toHaveURL(/\/edit$/)

  await page.getByLabel('Title').fill('Plan the next sprint')
  await page.getByLabel('Status').selectOption('DONE')
  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.getByText('Task updated')).toBeVisible()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  await expect(page.getByRole('heading', { name: 'Plan the next sprint', level: 1 })).toBeVisible()
  await expect(page.getByText('Done')).toBeVisible()
})

// Story I — Toast on successful task delete
test('shows a success toast after deleting a task and removes it from the list', async ({
  page,
}) => {
  await page.goto('/tasks')
  await page.getByRole('link', { name: /Write project proposal/ }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)

  await page.getByRole('button', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  await expect(page.getByText('Task deleted')).toBeVisible()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByText('Write project proposal')).toBeHidden()
})

// Story J — Error toast when an action fails, list not falsely updated
test('shows an error toast when a delete fails and keeps the task', async ({ page }) => {
  await page.goto('/tasks')
  await page.getByRole('link', { name: /Fix login bug/ }).click()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)

  // Make the DELETE fail (server unreachable).
  await page.route('**/tasks/*', (route) => {
    if (route.request().method() === 'DELETE') return route.abort()
    return route.continue()
  })

  await page.getByRole('button', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  // Error toast (the dismissible red toast div) shown alongside the inline
  // message; assert the toast specifically via its Dismiss button.
  const toast = page
    .locator('div[role="alert"]')
    .filter({ hasText: /couldn't delete/i })
  await expect(toast).toBeVisible()
  await expect(toast.getByRole('button', { name: 'Dismiss notification' })).toBeVisible()
  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
  await expect(page.getByRole('heading', { name: 'Fix login bug', level: 1 })).toBeVisible()
})

// Story G (dismiss) — toast can be dismissed via its close button
test('a toast can be dismissed with its close button', async ({ page }) => {
  await page.goto('/tasks/new')
  await page.getByLabel('Title').fill('Dismiss me')
  await page.getByRole('button', { name: 'Create task' }).click()

  const toast = page.getByText('Task created')
  await expect(toast).toBeVisible()
  await page.getByRole('button', { name: 'Dismiss notification' }).click()
  await expect(toast).toBeHidden()
})

// Story K — Pending/disabled submit button during an in-flight request
test('submit button shows a disabled pending state while saving', async ({ page }) => {
  await page.goto('/tasks/new')
  await page.route('**/tasks', async (route) => {
    if (route.request().method() === 'POST') {
      await new Promise((r) => setTimeout(r, 1000))
    }
    return route.continue()
  })

  await page.getByLabel('Title').fill('Slow save')
  await page.getByRole('button', { name: 'Create task' }).click()

  const pending = page.getByRole('button', { name: 'Saving…' })
  await expect(pending).toBeVisible()
  await expect(pending).toBeDisabled()

  await expect(page).toHaveURL(/\/tasks\/task-\d+$/)
})

// Story L — Dark mode toggle that persists across reloads
test('dark mode toggle switches the theme and persists across a reload', async ({ page }) => {
  await page.goto('/tasks')
  const html = page.locator('html')
  await expect(html).not.toHaveClass(/dark/)

  const toggle = page.getByRole('button', { name: 'Toggle dark mode' })
  await toggle.click()
  await expect(html).toHaveClass(/dark/)
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')

  // Persists across a reload (no flash back to light).
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)

  // Toggling back to light also persists.
  await page.getByRole('button', { name: 'Toggle dark mode' }).click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

// Story M — Legibility holds across pages in dark mode (badges/content present)
test('content and badges remain present on listing and detail in dark mode', async ({ page }) => {
  await page.goto('/tasks')
  await page.getByRole('button', { name: 'Toggle dark mode' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)

  // Listing content + badges still rendered in dark mode.
  await expect(page.getByText('Write project proposal')).toBeVisible()
  await expect(page.getByText('Open').first()).toBeVisible()

  // Navigate to a detail page; dark mode persists and content is visible.
  await page.getByRole('link', { name: /Deploy to staging/ }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(page.getByRole('heading', { name: 'Deploy to staging', level: 1 })).toBeVisible()
  await expect(page.getByText('Done')).toBeVisible()
})

// Story N — Keyboard activation of the theme toggle (focus + Enter)
test('the theme toggle can be operated with the keyboard', async ({ page }) => {
  await page.goto('/tasks')
  const toggle = page.getByRole('button', { name: 'Toggle dark mode' })
  await toggle.focus()
  await expect(toggle).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveClass(/dark/)
})

// Story O — ARIA: icon-only buttons announce labels; form inputs are associated
test('icon-only toggle has an aria-label and form inputs are label-associated', async ({
  page,
}) => {
  await page.goto('/tasks/new')
  // The theme toggle is icon-only but announces a label.
  await expect(page.getByRole('button', { name: 'Toggle dark mode' })).toBeVisible()
  // Each form field is reachable by its visible label (programmatic association).
  await expect(page.getByLabel('Title')).toBeVisible()
  await expect(page.getByLabel('Description')).toBeVisible()
  await expect(page.getByLabel('Status')).toBeVisible()
})
