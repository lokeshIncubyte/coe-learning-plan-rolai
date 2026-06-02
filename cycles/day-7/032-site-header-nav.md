---
id: cycle-032
slug: site-header-nav
status: done
source: "§3 root layout with shared header/nav (user story H)"
covers: atomic
---

## Behavior
`SiteHeader` is a props-driven presentational component rendering the shared site chrome used by the root layout: a banner with navigation links to the home page (`/`) and the tasks list (`/tasks`). Extracting it as a component keeps the navigation unit-testable, since the root `layout.tsx` (a server component) is covered by e2e instead.

## RED
- Test file: `/home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/SiteHeader.test.tsx`
- Assertion:
  ```ts
  import { render, screen } from '@testing-library/react'
  import { describe, it, expect } from 'vitest'
  import { SiteHeader } from './SiteHeader'

  describe('SiteHeader', () => {
    it('links to home and to the tasks list', () => {
      render(<SiteHeader />)
      const home = screen.getByRole('link', { name: /home/i })
      const tasks = screen.getByRole('link', { name: /tasks/i })
      expect(home).toHaveAttribute('href', '/')
      expect(tasks).toHaveAttribute('href', '/tasks')
    })
  })
  ```
- Why it fails: `components/SiteHeader.tsx` does not exist, so the import is unresolved and the render throws.

## GREEN
- Smallest change: Create `components/SiteHeader.tsx` exporting `SiteHeader()` returning a `<header>` containing a `<nav>` with two `next/link` `Link`s: `Home` → `/` and `Tasks` → `/tasks`.
- Files touched: `components/SiteHeader.tsx` (and, when wiring the page later, `app/layout.tsx` renders `<SiteHeader />` — not asserted in this cycle).

## REFACTOR
none
