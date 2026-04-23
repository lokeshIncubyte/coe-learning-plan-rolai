import { render, screen } from '@testing-library/react'
import { PicsumLabPage } from './PicsumLabPage'

describe('PicsumLabPage', () => {
  it('renders Gallery, Controls, and Preview regions', () => {
    render(<PicsumLabPage />)

    expect(screen.getByRole('region', { name: /gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /controls/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /preview/i })).toBeInTheDocument()
  })
})
