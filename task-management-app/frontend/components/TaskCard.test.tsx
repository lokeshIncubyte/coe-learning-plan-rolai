import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskCard } from './TaskCard'
import type { Task } from '@/lib/api'

const task: Task = {
  id: 't1',
  title: 'A very long task title that should wrap inside the card',
  description: null,
  status: 'IN_PROGRESS',
  userId: null,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
}

describe('TaskCard styling', () => {
  it('renders a full-width block card link with wrapping title and status', () => {
    render(<TaskCard task={task} />)
    const link = screen.getByRole('link', { name: /a very long task title/i })
    expect(link).toHaveAttribute('href', '/tasks/t1')
    expect(link.className).toMatch(/block/)
    expect(link.className).toMatch(/\bw-full\b/)
    expect(link.className).toMatch(/rounded/)
    expect(link.className).toMatch(/border/)
    const title = screen.getByText(/a very long task title/i)
    expect(title.className).toMatch(/break-words|truncate|break-all/)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })
})
