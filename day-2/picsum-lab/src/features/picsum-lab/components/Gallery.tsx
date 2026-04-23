import type { PicsumPhoto } from '../model/types'

type GalleryProps = {
  photos: PicsumPhoto[]
  selectedPhotoId: string | null
  onSelectPhoto: (photo: PicsumPhoto) => void
}

export function Gallery({ photos, selectedPhotoId, onSelectPhoto }: GalleryProps) {
  return (
    <ul>
      {photos.map((photo) => (
        <li key={photo.id}>
          <button
            type="button"
            aria-pressed={selectedPhotoId === photo.id}
            onClick={() => onSelectPhoto(photo)}
          >
            <span>{photo.id}</span>
            <span>{photo.author}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
