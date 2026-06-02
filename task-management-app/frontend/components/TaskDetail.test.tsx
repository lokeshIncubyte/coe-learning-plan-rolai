import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskDetail } from './TaskDetail'
import type { Task } from '@/lib/api'

const task: Task = {
  id: 'task-0001',
  title: 'Write project proposal',
  description: 'Draft the Q3 proposal',
  status: 'DONE',
  userId: null,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
}

describe('TaskDetail', () => {
  it('renders title, description, status and timestamps', () => {
    render(<TaskDetail task={task} />)
    expect(screen.getByRole('heading', { name: 'Write project proposal' })).toBeInTheDocument()
    expect(screen.getByText('Draft the Q3 proposal')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText(/Created/i)).toBeInTheDocument()
    expect(screen.getByText(/Updated/i)).toBeInTheDocument()
  })
})
