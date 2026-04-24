import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Gallery } from './Gallery'

describe('Gallery', () => {
  it('renders each row with id and author', () => {
    const photos = [
      {
        id: '1',
        author: 'Alice',
        width: 100,
        height: 100,
        url: 'https://example.com/1',
        download_url: 'https://example.com/download/1',
      },
      {
        id: '2',
        author: 'Bob',
        width: 200,
        height: 200,
        url: 'https://example.com/2',
        download_url: 'https://example.com/download/2',
      },
    ]

    render(
      <Gallery photos={photos} selectedPhotoId={null} onSelectPhoto={() => undefined} />,
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
