import { renderHook } from '@testing-library/react'
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
})
