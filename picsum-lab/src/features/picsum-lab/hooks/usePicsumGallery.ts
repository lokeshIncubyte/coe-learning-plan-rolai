import { useEffect, useState } from 'react'
import { fetchJson } from '../lib/fetchJson'
import { isPicsumListPayload } from '../model/guards'
import type { GalleryFetchState } from '../model/types'

export function usePicsumGallery(): GalleryFetchState {
  const [state, setState] = useState<GalleryFetchState>({ status: 'loading' })

  useEffect(() => {
    const toErrorState = (message: string): GalleryFetchState => ({
      status: 'error',
      message,
    })

    const loadGallery = async () => {
      try {
        const photos = await fetchJson('https://picsum.photos/v2/list', isPicsumListPayload)

        if (!photos) {
          setState(toErrorState('Invalid gallery payload'))
          return
        }

        setState({ status: 'success', photos })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        setState(toErrorState(message))
      }
    }

    void loadGallery()
  }, [])

  return state
}
