import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('links to home and to the tasks list', () => {
    render(<SiteHeader />)
    const home = screen.getByRole('link', { name: /home/i })
    const tasks = screen.getByRole('link', { name: /tasks/i })
    expect(home).toHaveAttribute('href', '/')
    expect(tasks).toHaveAttribute('href', '/tasks')
  })

  it('exposes an accessible, collapsed-by-default menu toggle', () => {
    render(<SiteHeader />)
    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i })
    // Toggle controls the primary nav and reports the collapsed state via ARIA.
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'primary-nav')
  })

  it('toggles aria-expanded when the menu button is activated', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)
    const toggle = screen.getByRole('button', { name: /toggle navigation menu/i })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps the nav links present in the DOM and reachable by role', () => {
    render(<SiteHeader />)
    // The links live inside the labelled primary navigation region and remain
    // queryable regardless of the collapsed/expanded state (CSS controls
    // visibility at the responsive breakpoint).
    const nav = screen.getByRole('navigation', { name: /primary/i })
    expect(nav).toHaveAttribute('id', 'primary-nav')
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /tasks/i })).toHaveAttribute('href', '/tasks')
  })
})
