---
id: cycle-049
slug: auth-token-storage
status: done
source: "Day 10 checklist §4: store the JWT securely; Logout clears the token (user story L)"
covers: atomic
---
## Behavior
A small auth helper module `lib/auth.ts` owns the JWT lifecycle in the browser using `localStorage` (documented trade-off vs httpOnly cookie). `setToken(token)` persists the token under a stable key, `getToken()` reads it back (or `null` when absent), and `clearToken()` removes it. This is the single source of truth used by both the API layer (to attach the Bearer header) and the UI (to know whether a user is signed in).

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/lib/auth.test.ts
- Assertion:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setToken, getToken, clearToken } from './auth'

describe('auth token storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull()
  })

  it('persists a token that getToken can read back', () => {
    setToken('mock.jwt.abc')
    expect(getToken()).toBe('mock.jwt.abc')
    expect(localStorage.getItem('access_token')).toBe('mock.jwt.abc')
  })

  it('clearToken removes the stored token', () => {
    setToken('mock.jwt.abc')
    clearToken()
    expect(getToken()).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
  })
})
```
- Why it fails: `lib/auth.ts` does not exist yet, so the import cannot resolve.

## GREEN
- Smallest change: Create `lib/auth.ts` exporting `setToken`, `getToken`, `clearToken` backed by `localStorage` under the key `access_token`. Guard each accessor with `typeof window === 'undefined'` returning `null`/no-op so it is SSR-safe.
- Files touched: lib/auth.ts

## REFACTOR
Extract the `'access_token'` key into a module-level const (already implied). none beyond that.
