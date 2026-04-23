import { useEffect, useState } from 'react'
import { fetchJson } from '../lib/fetchJson'
import type { GalleryFetchState } from '../model/types'

export function usePicsumGallery(): GalleryFetchState {
  const [state] = useState<GalleryFetchState>({ status: 'loading' })

  useEffect(() => {
    void fetchJson('https://picsum.photos/v2/list', (_data): _data is unknown => true)
  }, [])

  return state
}
