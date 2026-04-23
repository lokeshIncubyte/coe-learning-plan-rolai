import type { PicsumPhoto } from '../model/types'

type GalleryRowPhoto = Pick<PicsumPhoto, 'id' | 'author' | 'download_url'>

type GalleryRowProps = {
  photo: GalleryRowPhoto
  isSelected?: boolean
  onSelectPhoto: (photo: GalleryRowPhoto) => void
}

export function GalleryRow({ photo, isSelected = false, onSelectPhoto }: GalleryRowProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelectPhoto(photo)}
    >
      <span>{photo.id}</span>
      <span>{photo.author}</span>
    </button>
  )
}
