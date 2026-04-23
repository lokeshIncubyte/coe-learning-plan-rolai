import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePicsumGallery } from './usePicsumGallery'

describe('usePicsumGallery', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns loading state while the gallery request is in flight", () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise(() => {}) as Promise<Response>,
    )

    const { result } = renderHook(() => usePicsumGallery())

    expect(result.current).toEqual({ status: 'loading' })
  })

  it("returns success state with photos when the response is valid", async () => {
    const photos = [
      {
        id: '0',
        author: 'Alejandro Escamilla',
        width: 5000,
        height: 3333,
        url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
        download_url: 'https://picsum.photos/id/0/5000/3333',
      },
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => photos,
    } as Response)

    const { result } = renderHook(() => usePicsumGallery())

    await waitFor(() => {
      expect(result.current).toMatchObject({
        status: 'success',
        photos: [
          expect.objectContaining({
            id: expect.any(String),
            author: expect.any(String),
            width: expect.any(Number),
            height: expect.any(Number),
            url: expect.any(String),
            download_url: expect.any(String),
          }),
        ],
      })
    })
  })
})
