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

  it('wraps Gallery in a layout-left container and Preview in a layout-right container', () => {
    render(<PicsumLabPage />)

    const layout = screen.getByTestId('lab-layout')
    const left = within(layout).getByTestId('layout-left')
    const right = within(layout).getByTestId('layout-right')

    expect(within(left).getByRole('region', { name: /gallery/i })).toBeInTheDocument()
    expect(within(right).getByRole('region', { name: /preview/i })).toBeInTheDocument()
  })

  it('marks the left column as the viewport scroll container', () => {
    render(<PicsumLabPage />)

    const left = screen.getByTestId('layout-left')
    expect(left).toHaveAttribute('data-scroll-container')
  })

  it('renders a loading status inside the Gallery region while the fetch is pending', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}))

    render(<PicsumLabPage />)

    const gallery = screen.getByRole('region', { name: /gallery/i })
    expect(within(gallery).getByRole('status', { name: /loading gallery/i })).toBeInTheDocument()
  })
})
