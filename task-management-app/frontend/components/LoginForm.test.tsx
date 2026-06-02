import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('submits the typed email and password to onSubmit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'S3cret!pw')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledWith('alice@example.com', 'S3cret!pw')
  })

  it('shows an inline error and does not clear the form when onSubmit rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Invalid email or password'))
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i)
    expect(screen.getByLabelText(/email/i)).toHaveValue('alice@example.com')
  })
})
