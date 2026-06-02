---
id: cycle-055
slug: site-header-auth-state
status: pending
source: "Day 10 checklist §5: Show auth state in the header (logged-in user / logout button); user stories H & L"
covers: atomic
---
## Behavior
The header reflects auth state. A new props-driven `AuthNav` Client Component takes `{ email: string | null; onLogout: () => void }`. When `email` is null it renders a "Login" link to `/login`. When an `email` is present it shows that email and a "Logout" button that invokes `onLogout` when clicked. (`SiteHeader` will read the live token/email from `lib/auth` and pass them in; that wiring is exercised via e2e.)

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/AuthNav.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AuthNav } from './AuthNav'

describe('AuthNav', () => {
  it('shows a Login link when no user is signed in', () => {
    render(<AuthNav email={null} onLogout={() => {}} />)
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument()
  })

  it('shows the email and a Logout button when signed in, and fires onLogout', async () => {
    const onLogout = vi.fn()
    render(<AuthNav email="alice@example.com" onLogout={onLogout} />)

    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
```
- Why it fails: `components/AuthNav.tsx` does not exist, so the import cannot resolve.

## GREEN
- Smallest change: Create `components/AuthNav.tsx` (`'use client'`) rendering — when `email` is null — a `next/link` to `/login` labelled "Login"; otherwise a `<span>{email}</span>` plus a `<button>Logout</button>` wired to `onLogout`. Props: `{ email: string | null; onLogout: () => void }`.
- Files touched: components/AuthNav.tsx

## REFACTOR
Mount `AuthNav` inside `SiteHeader` (reading `getToken`/email + `clearToken`+`router.push('/login')` for logout); cover that integration in e2e rather than a new unit test. none required for this cycle.
