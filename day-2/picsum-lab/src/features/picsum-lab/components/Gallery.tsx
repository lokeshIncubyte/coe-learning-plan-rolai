import type { PicsumPhoto } from '../model/types'
import { GalleryRow } from './GalleryRow'

type GalleryRowPhoto = Pick<PicsumPhoto, 'id' | 'author' | 'download_url'>

type GalleryProps = {
  photos: PicsumPhoto[]
  selectedPhotoId: string | null
  onSelectPhoto: (photo: PicsumPhoto) => void
}

export function Gallery({ photos, selectedPhotoId, onSelectPhoto }: GalleryProps) {
  return (
    <ul>
      {photos.map((photo) => {
        const rowPhoto: GalleryRowPhoto = {
          id: photo.id,
          author: photo.author,
          download_url: photo.download_url,
        }

        return (
          <li key={photo.id}>
            <GalleryRow
              photo={rowPhoto}
              isSelected={selectedPhotoId === photo.id}
              onSelectPhoto={() => onSelectPhoto(photo)}
            />
          </li>
        )
      })}
    </ul>
  )
}
