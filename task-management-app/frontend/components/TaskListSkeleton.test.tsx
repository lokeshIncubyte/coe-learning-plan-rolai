import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TaskListSkeleton } from './TaskListSkeleton'

describe('TaskListSkeleton', () => {
  it('renders the requested number of pulsing placeholder cards inside a busy status region', () => {
    const { container } = render(<TaskListSkeleton count={4} />)
    const region = screen.getByRole('status')
    expect(region).toHaveAttribute('aria-busy', 'true')
    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses).toHaveLength(4)
  })

  it('renders a default number of placeholders when count is omitted', () => {
    const { container } = render(<TaskListSkeleton />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })
})
