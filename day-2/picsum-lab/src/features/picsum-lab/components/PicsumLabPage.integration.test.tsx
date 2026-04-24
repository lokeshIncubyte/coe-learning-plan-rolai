import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PicsumLabPage } from './PicsumLabPage'

describe('PicsumLabPage integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders at least one gallery row after gallery data loads successfully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => [
        {
          id: '0',
          author: 'Alejandro Escamilla',
          width: 5000,
          height: 3333,
          url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
          download_url: 'https://picsum.photos/id/0/5000/3333',
        },
      ],
    } as Response)

    render(<PicsumLabPage />)

    const galleryRegion = screen.getByRole('region', { name: /gallery/i })

    await waitFor(async () => {
      const rows = await within(galleryRegion).findAllByRole('button')
      expect(galleryRegion).toContainElement(rows[0])
    })
  })

  it('updates preview image URL to the selected photo id when a gallery row is clicked', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => [
        {
          id: '0',
          author: 'Alejandro Escamilla',
          width: 5000,
          height: 3333,
          url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
          download_url: 'https://picsum.photos/id/0/5000/3333',
        },
        {
          id: '1',
          author: 'Alejandro Escamilla',
          width: 5000,
          height: 3333,
          url: 'https://unsplash.com/photos/LNRyGwIJr5c',
          download_url: 'https://picsum.photos/id/1/5000/3333',
        },
      ],
    } as Response)

    const user = userEvent.setup()
    render(<PicsumLabPage />)

    const galleryRegion = screen.getByRole('region', { name: /gallery/i })
    const rows = await within(galleryRegion).findAllByRole('button')

    await user.click(rows[1])

    const previewRegion = screen.getByRole('region', { name: /preview/i })
    const previewImage = await within(previewRegion).findByRole('img')

    expect(previewImage).toHaveAttribute('src', expect.stringContaining('/id/1/'))
  })
})
