---
id: cycle-047
slug: theme-toggle-persist
status: done
source: "Day 9 §6 'Dark mode toggle (class strategy), persists across reloads' + user story L"
covers: atomic
---
## Behavior
A `ThemeToggle` client component toggles the `dark` class on `document.documentElement` (class strategy) and persists the choice to `localStorage` under a `theme` key. It is an icon-only button with an `aria-label` and `aria-pressed` reflecting the current mode. On mount it initializes from the persisted value. Clicking flips the mode: adds/removes the `dark` class on `<html>`, updates `localStorage`, and updates `aria-pressed`.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/ThemeToggle.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('toggles the dark class on <html> and persists the choice', async () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button', { name: /dark mode|theme/i })
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    await userEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(btn).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(btn)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('initializes from a persisted dark preference on mount', () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeToggle />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```
- Why it fails: `ThemeToggle` does not exist yet, so the import fails.

## GREEN
- Smallest change: create `ThemeToggle.tsx` ('use client') with `useState<'light'|'dark'>`, a `useEffect` that reads `localStorage.theme` on mount and applies the class, and a click handler that flips state, toggles `document.documentElement.classList`, and writes `localStorage`. Render an icon-only `<button aria-label aria-pressed>`. Also add `@custom-variant dark (&:where(.dark, .dark *));` to globals.css so Tailwind `dark:` utilities respond to the class (replacing the prefers-color-scheme block).
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/ThemeToggle.tsx (new); /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/app/globals.css

## REFACTOR
A no-flash inline script in the root layout to set the class before hydration is ideal but is a server-component change not unit-testable here — defer to e2e/manual.
