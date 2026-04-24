import { useState } from 'react'
import { usePicsumGallery } from '../hooks/usePicsumGallery'
import { buildPicsumImageUrl } from '../model/buildPicsumImageUrl'
import { Controls } from './Controls'
import { Gallery } from './Gallery'
import { Preview } from './Preview'

export function PicsumLabPage() {
  const galleryState = usePicsumGallery()
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [width, setWidth] = useState(600)

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
        <Controls onWidthChange={setWidth} />
      </section>

      <section aria-label="Preview" role="region">
        <h2>Preview</h2>
        <Preview url={previewUrl} />
      </section>
    </>
  )
}
