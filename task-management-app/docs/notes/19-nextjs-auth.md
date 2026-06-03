# 19. Next.js Authentication Patterns

## The core problem
Next.js renders some content on the server and some on the client. A JWT lives in the browser after login — you need to (a) store it somewhere safe, (b) attach it to every API call, (c) redirect unauthenticated users away from protected pages, and (d) clear it on logout. Each of those steps has a right place to live.

## Where to store the token

**localStorage (this project's choice):** simple, survives page refresh, easy to read from any component. Trade-off: JavaScript running in the page can access it, which makes it vulnerable to XSS attacks. Acceptable for a learning project; production apps often use httpOnly cookies (which JS cannot read) instead.

**httpOnly cookie:** the server sets `Set-Cookie: token=…; HttpOnly; Secure; SameSite=Strict`. The browser sends it on every request automatically, and no JS can read it. Requires a Next.js API route or middleware to act as a proxy.

## How it's used in this project

**Token storage** — `frontend/lib/auth.ts`

Three tiny helpers wrap `localStorage` and guard against the server-side render environment (where `window` is undefined):

```ts
const TOKEN_KEY = 'access_token'

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}
```

**Attaching the token to API calls** — `frontend/lib/api.ts`

`authHeaders()` reads the token and builds the `Authorization` header. Every fetch that needs auth spreads it in:

```ts
function authHeaders(): Record<string, string> {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// used in every authenticated request:
headers: { 'Content-Type': 'application/json', ...authHeaders() }
```

On a 401 response, `clearToken()` is called immediately so the stale token is not retried:

```ts
if (res.status === 401) clearToken()
```

**Login flow** — `frontend/app/login/page.tsx`

The page calls `login()` (which hits `POST /auth/login`), stores the returned token, then navigates to the originally requested page via the `?next=` query param:

```ts
async function handleSubmit(email: string, password: string) {
  const token = await login(email, password)
  setToken(token)
  toast.success('Signed in')
  const next = searchParams.get('next')
  router.push(next && next.startsWith('/') ? next : '/tasks')
  router.refresh()
}
```

`router.refresh()` re-runs server components so any server-rendered auth state updates immediately.

**Protected routes (client-side redirect)** — `frontend/components/TasksView.tsx`

Because this project stores the token in `localStorage` (not a cookie), there is no server-side token to read, so protection happens in `useEffect`:

```ts
useEffect(() => {
  if (!getToken()) {
    router.replace('/login?next=/tasks')
    return
  }
  // fetch tasks …
}, [router])
```

`router.replace` (not `push`) is used so the user can't hit Back and return to the protected page.

**Logout** — `frontend/components/AuthNav.tsx`

`AuthNav` receives an `onLogout` prop. The caller clears the token and the component renders a "Login" link when `email` is `null`:

```ts
export function AuthNav({ email, onLogout }: { email: string | null; onLogout: () => void }) {
  if (email === null) return <Link href="/login">Login</Link>
  return (
    <>
      <span>{email}</span>
      <button type="button" onClick={onLogout}>Logout</button>
    </>
  )
}
```

## Key insight
With `localStorage`, all auth checks happen on the client after hydration — there will be a brief flash before the redirect fires. httpOnly cookies solve this by letting middleware read the token on the server before the page renders, but they require more infrastructure. Know the trade-off; choose deliberately.
