---
id: cycle-041
slug: status-badge-colors
status: done
source: "Day 9 §3 'status badges (color per OPEN / IN_PROGRESS / DONE)' + user story D"
covers: atomic
---
## Behavior
The `StatusBadge` component renders a color-coded pill whose color is distinct per status. Each status maps to its own Tailwind background/text utility classes (e.g. neutral/gray for OPEN, amber for IN_PROGRESS, green for DONE) while keeping the existing human-friendly label. The status text remains present so the badge conveys status by text, not color alone (accessibility, user story O). Dark-mode legibility is provided by `dark:` variant classes on the same element.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/StatusBadge.test.tsx
- Assertion:
```ts
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge colors', () => {
  it('applies a distinct color class per status while keeping the label', () => {
    const { rerender } = render(<StatusBadge status="OPEN" />)
    const open = screen.getByText('Open')
    expect(open.className).toMatch(/gray|neutral|slate|zinc/)

    rerender(<StatusBadge status="IN_PROGRESS" />)
    const inProgress = screen.getByText('In Progress')
    expect(inProgress.className).toMatch(/amber|blue|yellow/)

    rerender(<StatusBadge status="DONE" />)
    const done = screen.getByText('Done')
    expect(done.className).toMatch(/green|emerald/)

    // colors must differ between statuses
    expect(open.className).not.toEqual(done.className)
  })
})
```
- Why it fails: the current `StatusBadge` renders a bare `<span>` with no className, so no color utility matches.

## GREEN
- Smallest change: add a `CLASSES: Record<TaskStatus, string>` map of Tailwind background/text classes (plus `dark:` variants) keyed by status, and apply it via `className` on the span along with shared pill utilities (rounded, px, py, text-xs, font-medium).
- Files touched: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/StatusBadge.tsx

## REFACTOR
Extract the shared pill base classes into a single string constant to avoid repetition; keep per-status classes in the map.
