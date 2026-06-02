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

  it('shows an empty state when there are no tasks', () => {
    render(<TaskList tasks={[]} />)
    expect(screen.getByText('No tasks yet')).toBeInTheDocument()
  })
})

const tasks: Task[] = [
  { id: 'a', title: 'One', description: null, status: 'OPEN', userId: null, createdAt: '', updatedAt: '' },
  { id: 'b', title: 'Two', description: null, status: 'DONE', userId: null, createdAt: '', updatedAt: '' },
]

describe('TaskList layout and empty state', () => {
  it('renders cards in a responsive multi-column grid', () => {
    const { container } = render(<TaskList tasks={tasks} />)
    const grid = container.querySelector('ul')!
    expect(grid.className).toMatch(/\bgrid\b/)
    expect(grid.className).toMatch(/grid-cols-1/)
    expect(grid.className).toMatch(/sm:grid-cols-2|lg:grid-cols-/)
    expect(grid.className).toMatch(/gap-/)
  })

  it('shows a friendly empty state with a create call-to-action when there are no tasks', () => {
    render(<TaskList tasks={[]} />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /create|new|first task/i })
    expect(cta).toHaveAttribute('href', '/tasks/new')
  })
})
