import { defineConfig, devices } from '@playwright/test'

// Runs against the LIVE deployed site (Vercel frontend + Railway backend + Neon).
// No webServer — we are testing the real deployment, not a local build.
export default defineConfig({
  testDir: './e2e-deployed',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: process.env.DEPLOYED_URL || 'https://task-management-rolai.vercel.app',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
