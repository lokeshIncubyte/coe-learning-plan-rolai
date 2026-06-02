---
id: cycle-050
slug: login-api
status: done
source: "Day 10 checklist §4: Submit → POST /auth/login; user story C (login returns a signed JWT)"
covers: happy-path
---
## Behavior
`lib/api.ts` gains a `login(email, password)` function that POSTs `{ email, password }` as JSON to `/auth/login`, and on success returns the `access_token` string from the `{ access_token }` envelope. This is the network primitive the login form will call.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/api.test.ts
- Assertion:
```ts
describe('login', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTs credentials to /auth/login and returns the access_token', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ access_token: 'mock.jwt.abc' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { login } = await import('./api')
    const token = await login('alice@example.com', 'S3cret!pw')

    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('http://localhost:3001/auth/login')
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ email: 'alice@example.com', password: 'S3cret!pw' })
    expect(token).toBe('mock.jwt.abc')
  })
})
```
- Why it fails: `api.ts` exports no `login` function, so the import is `undefined` and the call throws.

## GREEN
- Smallest change: Add an exported `async function login(email: string, password: string): Promise<string>` to `lib/api.ts` that POSTs the JSON body via `fetch(apiUrl('/auth/login'), …)` and returns `(await res.json()).access_token` on `res.ok`.
- Files touched: lib/api.ts

## REFACTOR
none — reuse of `apiUrl` keeps it tidy.
