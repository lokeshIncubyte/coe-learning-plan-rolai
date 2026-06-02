---
id: cycle-030
slug: task-list-empty-state
status: done
source: "§4 renders the list / Empty state when there are no tasks (user story B)"
covers: error-path
---

## Behavior
`TaskList` is a props-driven presentational component that takes `tasks: Task[]`. When the array is non-empty it renders one `TaskCard` per task. When the array is empty it renders no task rows and instead shows an empty-state message "No tasks yet". This drives both user story A (list) and user story B (empty state).

## RED
- Test file: `/home/lokesh/projects/coe-learning-plan-rolai/task-management-app/frontend/components/TaskList.test.tsx`
- Assertion:
  ```ts
  import { render, screen } from '@testing-library/react'
  import { describe, it, expect } from 'vitest'
  import { TaskList } from './TaskList'
  import type { Task } from '@/lib/api'

  const mk = (id: string, title: string): Task => ({
    id, title, description: null, status: 'OPEN', userId: null,
    createdAt: 'x', updatedAt: 'x',
  })

  describe('TaskList', () => {
    it('renders one link per task', () => {
      render(<TaskList tasks={[mk('task-0001', 'Alpha'), mk('task-0002', 'Beta')]} />)
      expect(screen.getByText('Alpha')).toBeInTheDocument()
      expect(screen.getByText('Beta')).toBeInTheDocument()
      expect(screen.getAllByRole('link')).toHaveLength(2)
    })

    it('shows an empty state and no rows when there are no tasks', () => {
      render(<TaskList tasks={[]} />)
      expect(screen.getByText('No tasks yet')).toBeInTheDocument()
      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })
  })
  ```
- Why it fails: `components/TaskList.tsx` does not exist, so the import is unresolved and the render throws.

## GREEN
- Smallest change: Create `components/TaskList.tsx` exporting `TaskList({ tasks }: { tasks: Task[] })`. If `tasks.length === 0`, return a `<p>No tasks yet</p>`. Otherwise map `tasks` to `<TaskCard key={task.id} task={task} />` inside a `<ul>`/`<li>` or a div list.
- Files touched: `components/TaskList.tsx`

## REFACTOR
none
