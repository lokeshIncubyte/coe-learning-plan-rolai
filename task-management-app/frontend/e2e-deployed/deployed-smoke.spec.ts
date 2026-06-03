import { test, expect } from '@playwright/test'

// Smoke test against the LIVE deployment (Vercel + Railway + Neon).
// Real auth (no register UI -> register via the API), real data (creates and
// then deletes its own task), real CORS. One serial journey to keep the shared
// Neon database clean.
const API = process.env.DEPLOYED_API_URL || 'https://backend-production-94c7.up.railway.app'
const stamp = Date.now()
const email = `e2e-${stamp}@example.com`
const password = 'password123'
const title = `E2E deployed task ${stamp}`

test('live journey: register -> login -> create -> view -> delete -> logout', async ({
  page,
  request,
}) => {
  // 1. Register a fresh user directly against the deployed API.
  const reg = await request.post(`${API}/auth/register`, {
    data: { name: 'E2E', email, password },
  })
  expect(reg.status(), 'register should return 201').toBe(201)

  // 2. Log in through the UI.
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Redirected to the protected tasks page; header reflects the session
  // (this exercises GET /auth/me end-to-end).
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()
  await expect(page.getByText(email)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()

  // 3. Create a task via the form.
  await page.getByRole('link', { name: 'New task' }).click()
  await expect(page).toHaveURL(/\/tasks\/new$/)
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Description').fill('created by deployed e2e')
  await page.getByRole('button', { name: 'Create task' }).click()

  // Real backend assigns a UUID id (not the mock's task-N).
  await expect(page).toHaveURL(/\/tasks\/[0-9a-f-]{20,}$/)
  await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible()

  // 4. It shows up in the list.
  await page.goto('/tasks')
  await expect(page.getByText(title)).toBeVisible()

  // 5. Delete it (open detail -> confirm), then it's gone from the list.
  await page.getByRole('link', { name: new RegExp(title) }).click()
  await expect(page).toHaveURL(/\/tasks\/[0-9a-f-]{20,}$/)
  await page.getByRole('button', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByText(title)).toBeHidden()

  // 6. Logout -> the protected route bounces back to login.
  await page.getByRole('button', { name: 'Logout' }).click()
  await page.goto('/tasks')
  await expect(page).toHaveURL(/\/login/)
})
