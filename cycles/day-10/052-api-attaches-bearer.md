---
id: cycle-052
slug: api-attaches-bearer
status: done
source: "Day 10 checklist §4: Attach the token to API requests in lib/api.ts (Authorization: Bearer)"
covers: atomic
---
## Behavior
Authenticated task requests carry the stored JWT. When a token exists (via `lib/auth.ts` `getToken()`), `lib/api.ts` sends an `Authorization: Bearer <token>` header on its fetch calls. This cycle pins the behavior on a representative mutating call (`createTask`); when no token is stored, no `Authorization` header is sent.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
describe('Authorization header', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
    localStorage.clear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('attaches Bearer token to createTask when a token is stored', async () => {
    localStorage.setItem('access_token', 'mock.jwt.abc')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 't1', title: 'x', description: null, status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { createTask } = await import('./api')
    await createTask({ title: 'x', description: null, status: 'OPEN' })

    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers['Authorization']).toBe('Bearer mock.jwt.abc')
  })

  it('omits Authorization when no token is stored', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 't1', title: 'x', description: null, status: 'OPEN', userId: null, createdAt: 'x', updatedAt: 'x' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { createTask } = await import('./api')
    await createTask({ title: 'x', description: null, status: 'OPEN' })

    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers['Authorization']).toBeUndefined()
  })
})
```
- Why it fails: `sendTaskJson` currently sets only `{ 'Content-Type': 'application/json' }` and never reads the stored token, so no `Authorization` header is present.

## GREEN
- Smallest change: Add an `authHeaders()` helper in `lib/api.ts` that returns `{ Authorization: 'Bearer ' + t }` when `getToken()` returns a token, else `{}`. Spread it into the `headers` of `sendTaskJson` (and `getTasks`/`getTask`/`deleteTask` for consistency). Import `getToken` from `./auth`.
- Files touched: lib/api.ts

## REFACTOR
Funnel all fetches through a shared `buildHeaders`/request helper if duplication grows. none required now.
