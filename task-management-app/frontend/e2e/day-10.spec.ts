import { test, expect } from '@playwright/test'

// Day 10 — Frontend authentication: login page, token storage, protected
// routes, redirect-to-login, header showing the signed-in email + Logout,
// logout clearing the session, and session-expiry (401) redirecting back.
//
// Implemented this day (verified against app/ + components/ + lib/):
//   - /login            -> LoginForm; on success login() stores token in
//                          localStorage('access_token'), toasts "Signed in",
//                          and router.push(next ?? '/tasks').
//   - LoginForm shows an inline role=alert error when login() rejects.
//   - lib/auth.ts setToken/getToken/clearToken (localStorage 'access_token').
//   - TasksView / TaskDetailView / NewTaskView are client components that
//     redirect to /login?next=<path> when no token is present, before showing
//     any task data.
//   - HeaderAuth calls getMe(); when a token resolves it renders the user's
//     email + a Logout button (AuthNav). Logout clears the token and pushes
//     /login. Unauthenticated it shows a Login link.
//   - lib/api.ts clears the token on a 401 from getTasks/getMe, so an expired
//     session redirects the protected view back to /login.
//
// The mock /auth/login returns a token for any non-empty email+password and
// /auth/me returns { email: 'authenticated@example.com' } for any Bearer
// mock.jwt.* token. To exercise the failure path we intercept /auth/login.
//
// Stories NOT covered as a frontend user flow:
//   - A–G are pure backend API contract stories (register/login/guards). They
//     are not frontend behaviour and there is no register UI in app/, so they
//     are not e2e'd here.
//   - M (cross-origin deployed app) is a deployment story with no local
//     user-observable flow; omitted.

const TOKEN_KEY = 'access_token'

test.beforeEach(async ({ page, context }) => {
  await page.request.post('http://localhost:3001/__test__/reset')
  // Start every test with a pristine, signed-out browser session.
  await context.clearCookies()
  await page.addInitScript((key) => {
    try {
      localStorage.removeItem(key)
    } catch {}
  }, TOKEN_KEY)
})

// Helper: seed a valid token into localStorage so the next navigation is
// treated as a signed-in session (mirrors what setToken() does after login).
async function signIn(page: import('@playwright/test').Page) {
  // Seed a valid token before any page script runs, so the next navigation is
  // treated as a signed-in session. Registered after the beforeEach removeItem
  // init script, so it wins (init scripts run in registration order).
  await page.addInitScript((key) => {
    try {
      localStorage.setItem(key, 'mock.jwt.user')
    } catch {}
  }, TOKEN_KEY)
}

// The header (banner) holds the auth chrome. Scope auth-link assertions here so
// a seeded task card titled "Fix login bug" can't be mistaken for the Login link.
function header(page: import('@playwright/test').Page) {
  return page.getByRole('banner')
}

// Story H — User logs in via the frontend and is redirected to tasks
test('logging in redirects to the tasks page and shows seeded tasks', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()

  await page.getByLabel('Email').fill('alice@example.com')
  await page.getByLabel('Password').fill('S3cret!pw')
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Redirected to the tasks page, which now loads protected data.
  await expect(page).toHaveURL(/\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: /Write project proposal/ })).toBeVisible()
})

// Story H — Header shows the signed-in email and a Logout button after login
test('the header shows the signed-in email and a Logout button after login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('alice@example.com')
  await page.getByLabel('Password').fill('S3cret!pw')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL(/\/tasks$/)
  // HeaderAuth resolves getMe() -> authenticated@example.com (mock /auth/me).
  await expect(page.getByText('authenticated@example.com')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
  // The signed-out "Login" link is no longer shown.
  await expect(header(page).getByRole('link', { name: 'Login', exact: true })).toBeHidden()
})

// Story H — A successful login surfaces a confirmation toast
test('a successful login shows a "Signed in" confirmation', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('alice@example.com')
  await page.getByLabel('Password').fill('S3cret!pw')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByText('Signed in')).toBeVisible()
})

// Story I — Login fails with a visible inline error message; no redirect.
test('a failed login stays on the login page and shows an inline error', async ({ page }) => {
  // Force the backend to reject the credentials.
  await page.route('**/auth/login', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      }),
    }),
  )

  await page.goto('/login')
  await page.getByLabel('Email').fill('alice@example.com')
  await page.getByLabel('Password').fill('wrongPw')
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Inline error is shown and we remain on /login.
  await expect(page.getByText('Invalid credentials')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
  // No session was created: still the signed-out Login link in the header.
  await expect(header(page).getByRole('link', { name: 'Login', exact: true })).toBeVisible()
})

// Story J — Unauthenticated user visiting /tasks is redirected to login
test('visiting /tasks while signed out redirects to the login page', async ({ page }) => {
  await page.goto('/tasks')
  // TasksView detects no token and replaces the URL with /login?next=/tasks.
  await expect(page).toHaveURL(/\/login\?next=%2Ftasks$|\/login\?next=\/tasks$/)
  await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
  // Protected content never rendered.
  await expect(page.getByText('Write project proposal')).toBeHidden()
})

// Story J — Unauthenticated user visiting a task detail page is redirected too
test('visiting a task detail page while signed out redirects to login', async ({ page }) => {
  // task-0001 = "Write project proposal" from the seed.
  await page.goto('/tasks/task-0001')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
})

// Story J — After being bounced to login, logging in returns to the target page
test('redirect preserves the destination: login then land back on the target', async ({ page }) => {
  await page.goto('/tasks/new')
  await expect(page).toHaveURL(/\/login\?next=/)

  await page.getByLabel('Email').fill('alice@example.com')
  await page.getByLabel('Password').fill('S3cret!pw')
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Sent to the originally-requested page, now authenticated.
  await expect(page).toHaveURL(/\/tasks\/new$/)
  await expect(page.getByRole('heading', { name: 'New task', level: 1 })).toBeVisible()
  await expect(page.getByLabel('Title')).toBeVisible()
})

// Story L — Logout clears the session and returns to login; /tasks bounces again
test('logging out clears the session and re-protects the tasks page', async ({ page }) => {
  await signIn(page)
  await page.goto('/tasks')
  await expect(page.getByRole('heading', { name: 'Tasks', level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()

  await page.getByRole('button', { name: 'Logout' }).click()

  // Redirected to login and the signed-in chrome is gone.
  await expect(page).toHaveURL(/\/login$/)
  await expect(header(page).getByRole('link', { name: 'Login', exact: true })).toBeVisible()
  await expect(page.getByText('authenticated@example.com')).toBeHidden()

  // Navigating back to /tasks (client-side nav, no reload) bounces to login
  // again because the stored session was cleared.
  await header(page).getByRole('link', { name: 'Tasks', exact: true }).click()
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
})

// Story K — Session expiry (a 401 mid-session) redirects back to login
test('an expired session (401) redirects the tasks page back to login', async ({ page }) => {
  await signIn(page)

  // The token is present, but the backend now rejects the protected fetch.
  // lib/api.getTasks clears the token on 401, and TasksView then redirects.
  await page.route('**/tasks?*', (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }),
      })
    }
    return route.continue()
  })

  await page.goto('/tasks')

  // Bounced back to login; the cleared token means the signed-out Login link returns.
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Sign in', level: 1 })).toBeVisible()
})

// Story J — A signed-out visitor sees the public Login link in the header
test('the header shows a Login link when signed out', async ({ page }) => {
  await page.goto('/')
  await expect(header(page).getByRole('link', { name: 'Login', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Logout' })).toBeHidden()
})
