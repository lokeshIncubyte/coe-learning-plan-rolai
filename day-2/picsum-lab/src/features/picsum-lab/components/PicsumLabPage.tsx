import { useState } from 'react'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { usePicsumGallery } from '../hooks/usePicsumGallery'
import { buildPicsumImageUrl } from '../model/buildPicsumImageUrl'
import { isStoredPicsumLabPrefsV1 } from '../model/guards'
import type { PicsumLabPrefsData } from '../model/types'
import { Controls } from './Controls'
import { Gallery } from './Gallery'
import { Preview } from './Preview'

const PREFS_KEY = 'picsum-lab-prefs'
const DEFAULT_PREFS: PicsumLabPrefsData = { width: 600, height: 400 }

export function PicsumLabPage() {
  const galleryState = usePicsumGallery()
  const prefs = useLocalStorageState(PREFS_KEY, DEFAULT_PREFS, isStoredPicsumLabPrefsV1)
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [width, setWidth] = useState(prefs.width)

  const previewUrl = selectedPhotoId
    ? buildPicsumImageUrl({
        source: { kind: 'id', id: selectedPhotoId },
        width,
        height: 400,
        effects: { grayscale: false, blur: false },
      })
    : null

  return (
    <>
      <section aria-label="Gallery" role="region">
        <h2>Gallery</h2>
        {galleryState.status === 'success' && (
          <Gallery
            photos={galleryState.photos}
            selectedPhotoId={selectedPhotoId}
            onSelectPhoto={(photo) => setSelectedPhotoId(photo.id)}
          />
        )}
      </section>

      <section aria-label="Controls" role="region">
        <h2>Controls</h2>
        <Controls width={width} onWidthChange={setWidth} />
      </section>

      <section aria-label="Preview" role="region">
        <h2>Preview</h2>
        <Preview url={previewUrl} />
      </section>
    </>
  )
}
