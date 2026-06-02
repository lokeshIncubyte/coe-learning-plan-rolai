import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // The mock API (e2e/mock-api/server.mjs) is a SINGLE shared in-memory instance
  // that each test resets + mutates in beforeEach. Running spec files in parallel
  // across workers lets one file's reset wipe another file's state mid-test, so
  // the whole suite must run on a single worker. Tests within a file still run in
  // declaration order; mutating files additionally use `mode: 'serial'`.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node e2e/mock-api/server.mjs',
      url: 'http://localhost:3001/tasks/stats',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:3002',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
