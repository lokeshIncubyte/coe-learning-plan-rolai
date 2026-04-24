import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GalleryRow } from './GalleryRow'

describe('GalleryRow', () => {
  it('calls onSelectPhoto with clicked photo', async () => {
    const user = userEvent.setup()
    const photo = {
      id: '3',
      author: 'Carol',
      download_url: 'https://example.com/download/3',
    }
    const onSelectPhoto = vi.fn()

    render(<GalleryRow photo={photo} onSelectPhoto={onSelectPhoto} />)

    await user.click(screen.getByRole('button', { name: /3/i }))

    expect(onSelectPhoto).toHaveBeenCalledWith(photo)
  })

  it('renders a thumbnail image referencing the photo id', () => {
    const photo = {
      id: '7',
      author: 'Dave',
      download_url: 'https://example.com/download/7',
    }

    render(<GalleryRow photo={photo} onSelectPhoto={vi.fn()} />)

    const thumbnail = screen.getByRole('img')
    expect(thumbnail).toHaveAttribute('src', expect.stringContaining('/id/7/'))
  })

  it('uses photo.author as the thumbnail alt text', () => {
    const photo = {
      id: '11',
      author: 'Eve',
      download_url: 'https://example.com/download/11',
    }

    render(<GalleryRow photo={photo} onSelectPhoto={vi.fn()} />)

    expect(screen.getByRole('img', { name: 'Eve' })).toBeInTheDocument()
  })
})
