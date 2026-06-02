import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskForm } from './TaskForm'

describe('TaskForm validation', () => {
  it('blocks submit and shows an error when the title is blank', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} submitLabel="Create" />)

    await userEvent.type(screen.getByLabelText(/title/i), '   ')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
  })

  it('calls onSubmit with trimmed controlled values when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TaskForm onSubmit={onSubmit} submitLabel="Create" />)

    await userEvent.type(screen.getByLabelText(/title/i), '  Buy milk  ')
    await userEvent.type(screen.getByLabelText(/description/i), 'Full fat')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(onSubmit).toHaveBeenCalledWith({ title: 'Buy milk', description: 'Full fat', status: 'OPEN' })
  })
})
