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
