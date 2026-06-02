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
