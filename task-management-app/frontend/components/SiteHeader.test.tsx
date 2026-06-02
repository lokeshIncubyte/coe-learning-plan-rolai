import { render, screen } from '@testing-library/react'
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
})
