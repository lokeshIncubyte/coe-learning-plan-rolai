import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AuthNav } from './AuthNav'

describe('AuthNav', () => {
  it('shows a Login link when no user is signed in', () => {
    render(<AuthNav email={null} onLogout={() => {}} />)
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument()
  })

  it('shows the email and a Logout button when signed in, and fires onLogout', async () => {
    const onLogout = vi.fn()
    render(<AuthNav email="alice@example.com" onLogout={onLogout} />)

    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /logout/i }))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
