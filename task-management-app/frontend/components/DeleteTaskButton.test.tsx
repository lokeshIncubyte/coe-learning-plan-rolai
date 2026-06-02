import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DeleteTaskButton } from './DeleteTaskButton'

describe('DeleteTaskButton', () => {
  it('requires confirmation and does not call onConfirm when cancelled', async () => {
    const onConfirm = vi.fn()
    render(<DeleteTaskButton onConfirm={onConfirm} />)

    await userEvent.click(screen.getByRole('button', { name: /delete task/i }))
    expect(screen.getByText(/delete this task\?/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByText(/delete this task\?/i)).not.toBeInTheDocument()
  })

  it('calls onConfirm once when confirmed', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(<DeleteTaskButton onConfirm={onConfirm} />)

    await userEvent.click(screen.getByRole('button', { name: /delete task/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})

describe('DeleteTaskButton accessibility', () => {
  it('exposes an aria-label and a visible focus ring on the delete trigger', () => {
    render(<DeleteTaskButton onConfirm={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: /delete task/i })
    expect(trigger).toHaveAttribute('aria-label')
    expect(trigger.className).toMatch(/focus-visible:/)
  })

  it('still confirms deletion via keyboard', async () => {
    const onConfirm = vi.fn()
    render(<DeleteTaskButton onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: /delete task/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
