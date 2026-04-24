import { useEffect } from 'react'
import './PicsumLabPage.css'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { usePicsumGallery } from '../hooks/usePicsumGallery'
import { buildPicsumImageUrl } from '../model/buildPicsumImageUrl'
import { isStoredPicsumLabPrefsV1 } from '../model/guards'
import type { PicsumLabPrefsData } from '../model/types'
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
  const [prefs, setPrefs] = useLocalStorageState(
    PREFS_KEY,
    DEFAULT_PREFS,
    isStoredPicsumLabPrefsV1,
  )

  useEffect(() => {
    if (galleryState.status !== 'success' || prefs.selectedPhotoId === null) {
      return
    }
    const stillExists = galleryState.photos.some(
      (photo) => photo.id === prefs.selectedPhotoId,
    )
    if (!stillExists) {
      setPrefs({ ...prefs, selectedPhotoId: null })
    }
  }, [galleryState, prefs, setPrefs])

  const previewUrl = prefs.selectedPhotoId
    ? buildPicsumImageUrl({
        source: { kind: 'id', id: prefs.selectedPhotoId },
        width: prefs.width,
        height: prefs.height,
        effects: prefs.effects,
      })
    : null

  return (
    <div data-testid="lab-layout" className="lab-layout">
      <div data-testid="layout-left" className="lab-layout__left">
        <section aria-label="Gallery" role="region">
          <h2>Gallery</h2>
          {(galleryState.status === 'idle' || galleryState.status === 'loading') && (
            <p role="status" aria-label="Loading gallery">
              Loading gallery
            </p>
          )}
          {galleryState.status === 'success' && (
            <Gallery
              photos={galleryState.photos}
              selectedPhotoId={prefs.selectedPhotoId}
              onSelectPhoto={(photo) => setPrefs({ ...prefs, selectedPhotoId: photo.id })}
            />
          )}
          {galleryState.status === 'error' && <p role="alert">{galleryState.message}</p>}
        </section>
      </div>

      <div data-testid="layout-right" className="lab-layout__right">
        <section aria-label="Preview" role="region">
          <h2>Preview</h2>
          <Preview url={previewUrl} />
        </section>

        <section aria-label="Controls" role="region">
          <h2>Controls</h2>
          <Controls
            width={prefs.width}
            height={prefs.height}
            grayscale={prefs.effects.grayscale}
            blur={prefs.effects.blur}
            onWidthChange={(width) => setPrefs({ ...prefs, width })}
            onHeightChange={(height) => setPrefs({ ...prefs, height })}
            onGrayscaleChange={(grayscale) =>
              setPrefs({ ...prefs, effects: { ...prefs.effects, grayscale } })
            }
            onBlurChange={(blur) => setPrefs({ ...prefs, effects: { ...prefs.effects, blur } })}
          />
        </section>
      </div>
    </div>
  )
}
