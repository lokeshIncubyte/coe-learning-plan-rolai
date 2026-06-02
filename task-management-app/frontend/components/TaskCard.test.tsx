import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskCard } from './TaskCard'
import type { Task } from '@/lib/api'

const task: Task = {
  id: 'task-0001',
  title: 'Write project proposal',
  description: 'Draft the Q3 proposal',
  status: 'IN_PROGRESS',
  userId: null,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
}

describe('TaskCard', () => {
  it('shows the title and status and links to the detail page', () => {
    render(<TaskCard task={task} />)
    expect(screen.getByText('Write project proposal')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Write project proposal/i })
    expect(link).toHaveAttribute('href', '/tasks/task-0001')
  })
})
