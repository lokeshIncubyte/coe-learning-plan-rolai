---
id: cycle-053
slug: api-401-clears-token
status: pending
source: "Day 10 checklist §5: Handle 401 from the API (token expired); user story K (session expiry)"
covers: error-path
---
## Behavior
When an authenticated read returns `401 Unauthorized` (expired/invalid token), the API layer clears the stored session so the app can redirect to login. `getTasks` throws an Error tagged as unauthorized AND calls `clearToken()` as a side effect, leaving no stale token behind. (The redirect itself is wired in the page/e2e layer.)

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
describe('401 handling', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
    localStorage.setItem('access_token', 'mock.jwt.expired')
  })
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('clears the stored token and throws when getTasks returns 401', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { getTasks } = await import('./api')
    await expect(getTasks(1, 10)).rejects.toThrow()
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})
```
- Why it fails: `getTasks` currently throws a generic `Failed to fetch tasks: 401` error but never clears the token, so `access_token` remains in `localStorage`.

## GREEN
- Smallest change: In `getTasks` (and ideally a shared response check), when `res.status === 401` call `clearToken()` before throwing. Import `clearToken` from `./auth`.
- Files touched: lib/api.ts

## REFACTOR
Centralize the `if (res.status === 401) clearToken()` check in one `assertOk`/response helper reused by every fetch wrapper. none strictly required.
