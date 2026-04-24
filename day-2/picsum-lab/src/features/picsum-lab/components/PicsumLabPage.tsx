import { useState } from 'react'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { usePicsumGallery } from '../hooks/usePicsumGallery'
import { buildPicsumImageUrl } from '../model/buildPicsumImageUrl'
import { isStoredPicsumLabPrefsV1 } from '../model/guards'
import type { ImageEffects, PicsumLabPrefsData } from '../model/types'
import { Controls } from './Controls'
import { Gallery } from './Gallery'
import { Preview } from './Preview'

const PREFS_KEY = 'picsum-lab-prefs'
const DEFAULT_PREFS: PicsumLabPrefsData = {
  width: 600,
  height: 400,
  selectedPhotoId: null,
  effects: { grayscale: false, blur: false },
}

export function PicsumLabPage() {
  const galleryState = usePicsumGallery()
  const prefs = useLocalStorageState(PREFS_KEY, DEFAULT_PREFS, isStoredPicsumLabPrefsV1)
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [width, setWidth] = useState(prefs.width)
  const [height, setHeight] = useState(prefs.height)
  const [effects, setEffects] = useState<ImageEffects>({ grayscale: false, blur: false })

  const previewUrl = selectedPhotoId
    ? buildPicsumImageUrl({
        source: { kind: 'id', id: selectedPhotoId },
        width,
        height,
        effects,
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
        {galleryState.status === 'error' && <p role="alert">{galleryState.message}</p>}
      </section>

      <section aria-label="Controls" role="region">
        <h2>Controls</h2>
        <Controls
          width={width}
          height={height}
          grayscale={effects.grayscale}
          blur={effects.blur}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onGrayscaleChange={(enabled) => setEffects((prev) => ({ ...prev, grayscale: enabled }))}
          onBlurChange={(enabled) => setEffects((prev) => ({ ...prev, blur: enabled }))}
        />
      </section>

      <section aria-label="Preview" role="region">
        <h2>Preview</h2>
        <Preview url={previewUrl} />
      </section>
    </>
  )
}
