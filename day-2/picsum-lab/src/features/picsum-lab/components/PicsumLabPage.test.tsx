import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
import { PicsumLabPage } from './PicsumLabPage'

describe('PicsumLabPage', () => {
  it('renders Gallery, Controls, and Preview regions', () => {
    render(<PicsumLabPage />)

    expect(screen.getByRole('region', { name: /gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /controls/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /preview/i })).toBeInTheDocument()
  })

  it('renders a loading status inside the Gallery region while the fetch is pending', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))

    render(<PicsumLabPage />)

    const gallery = screen.getByRole('region', { name: /gallery/i })
    expect(within(gallery).getByRole('status', { name: /loading gallery/i })).toBeInTheDocument()
  })
})
