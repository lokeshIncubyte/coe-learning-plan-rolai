import { usePicsumGallery } from '../hooks/usePicsumGallery'
import { Gallery } from './Gallery'

export function PicsumLabPage() {
  const galleryState = usePicsumGallery()

  return (
    <>
      <section aria-label="Gallery" role="region">
        <h2>Gallery</h2>
        {galleryState.status === 'success' && (
          <Gallery
            photos={galleryState.photos}
            selectedPhotoId={null}
            onSelectPhoto={() => {}}
          />
        )}
      </section>

      <section aria-label="Controls" role="region">
        <h2>Controls</h2>
      </section>

      <section aria-label="Preview" role="region">
        <h2>Preview</h2>
      </section>
    </>
  )
}
