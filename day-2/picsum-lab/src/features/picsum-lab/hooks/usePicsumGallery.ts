import { useEffect, useState } from 'react'
import { fetchJson } from '../lib/fetchJson'
import { isPicsumListPayload } from '../model/guards'
import type { GalleryFetchState } from '../model/types'

export function usePicsumGallery(): GalleryFetchState {
  const [state, setState] = useState<GalleryFetchState>({ status: 'loading' })

  useEffect(() => {
    const loadGallery = async () => {
      const photos = await fetchJson('https://picsum.photos/v2/list', isPicsumListPayload)

      if (photos) {
        setState({ status: 'success', photos })
      }
    }

    void loadGallery()
  }, [])

  return state
}
