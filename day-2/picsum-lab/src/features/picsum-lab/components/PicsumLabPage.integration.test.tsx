import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

  it('updates preview image URL width when the width input changes', async () => {
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

    const user = userEvent.setup()
    render(<PicsumLabPage />)

    const galleryRegion = screen.getByRole('region', { name: /gallery/i })
    const rows = await within(galleryRegion).findAllByRole('button')
    await user.click(rows[0])

    const widthInput = screen.getByLabelText(/width/i)
    fireEvent.change(widthInput, { target: { value: '800' } })

    const previewRegion = screen.getByRole('region', { name: /preview/i })
    const previewImage = await within(previewRegion).findByRole('img')

    expect(previewImage).toHaveAttribute('src', expect.stringContaining('/800/'))
  })

  it('pre-populates the width control from saved preferences on mount', async () => {
    const storage = new Map<string, string>()
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value)
        },
        removeItem: (key: string) => {
          storage.delete(key)
        },
        clear: () => {
          storage.clear()
        },
      },
    })

    localStorage.setItem(
      'picsum-lab-prefs',
      JSON.stringify({
        version: 1,
        savedAt: '2026-01-01T00:00:00.000Z',
        data: { width: 640, height: 480 },
      }),
    )

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

    const widthInput = screen.getByLabelText(/width/i)
    expect(widthInput).toHaveValue(640)
  })

  it('shows an error message in the gallery when the fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))

    render(<PicsumLabPage />)

    const galleryRegion = screen.getByRole('region', { name: /gallery/i })
    const errorAlert = await within(galleryRegion).findByRole('alert')

    expect(errorAlert).toHaveTextContent(/network down/i)
  })
})
