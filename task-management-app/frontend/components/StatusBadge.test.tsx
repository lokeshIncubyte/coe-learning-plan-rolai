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
