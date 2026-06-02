---
id: cycle-051
slug: login-api-401
status: pending
source: "Day 10 user story D (login with wrong credentials → 401) / story I (visible error)"
covers: error-path
---
## Behavior
When `/auth/login` responds with a non-ok status (e.g. 401 with `{ message: 'Invalid credentials' }`), `login()` throws an Error carrying the backend message so the login form can surface "Invalid email or password" inline. No token is returned.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
it('throws with the backend message on 401', async () => {
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    json: async () => ({ statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' }),
  })
  vi.stubGlobal('fetch', fetchMock)

  const { login } = await import('./api')
  await expect(login('alice@example.com', 'wrongPw')).rejects.toThrow('Invalid credentials')
})
```
- Why it fails: the `login` happy-path implementation from cycle-050 does not yet branch on `!res.ok`, so it would try to read `access_token` off the error body and return `undefined` instead of throwing.

## GREEN
- Smallest change: In `login()`, after `fetch`, if `!res.ok` read the JSON body and `throw new Error(body?.message ?? 'Login failed')`.
- Files touched: lib/api.ts

## REFACTOR
Consider reusing the existing message-extraction logic from `sendTaskJson`; keep simple if not a clean fit. none required.
