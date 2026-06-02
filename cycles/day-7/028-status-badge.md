---
id: cycle-028
slug: status-badge
status: done
source: "§4/§5 each row shows the task's status (user stories A, C)"
covers: atomic
---

## Behavior
`StatusBadge` is a props-driven presentational Client component that takes a `status` of `'OPEN' | 'IN_PROGRESS' | 'DONE'` and renders a human-readable label: `OPEN` → "Open", `IN_PROGRESS` → "In Progress", `DONE` → "Done". The badge text is what the list and detail views surface, so the mapping is the single source of truth for status display.

## RED
- Test file: `/home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/StatusBadge.test.tsx`
- Assertion:
  ```ts
  import { render, screen } from '@testing-library/react'
  import { describe, it, expect } from 'vitest'
  import { StatusBadge } from './StatusBadge'

  describe('StatusBadge', () => {
    it('renders a friendly label for each status', () => {
      const { rerender } = render(<StatusBadge status="OPEN" />)
      expect(screen.getByText('Open')).toBeInTheDocument()

      rerender(<StatusBadge status="IN_PROGRESS" />)
      expect(screen.getByText('In Progress')).toBeInTheDocument()

      rerender(<StatusBadge status="DONE" />)
      expect(screen.getByText('Done')).toBeInTheDocument()
    })
  })
  ```
- Why it fails: `components/StatusBadge.tsx` does not exist, so the import is unresolved and rendering throws.

## GREEN
- Smallest change: Create `components/StatusBadge.tsx` exporting `StatusBadge({ status }: { status: TaskStatus })` with a `Record<TaskStatus, string>` label map and a `<span>` rendering the label. Import the `TaskStatus`/`Task['status']` type from `lib/api.ts`.
- Files touched: `components/StatusBadge.tsx`

## REFACTOR
Add Tailwind colour classes keyed by status later (visual polish, not asserted here).
