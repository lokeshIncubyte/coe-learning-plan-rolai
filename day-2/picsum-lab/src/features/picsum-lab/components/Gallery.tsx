import type { PicsumPhoto } from '../model/types'
import { GalleryRow } from './GalleryRow'

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
          <GalleryRow
            photo={{
              id: photo.id,
              author: photo.author,
              download_url: photo.download_url,
            }}
            isSelected={selectedPhotoId === photo.id}
            onSelectPhoto={() => onSelectPhoto(photo)}
          />
        </li>
      ))}
    </ul>
  )
}
