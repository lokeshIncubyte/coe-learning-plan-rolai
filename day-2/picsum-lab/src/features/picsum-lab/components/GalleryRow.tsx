import { buildPicsumImageUrl } from '../model/buildPicsumImageUrl'
import type { PicsumPhoto } from '../model/types'

type GalleryRowPhoto = Pick<PicsumPhoto, 'id' | 'author' | 'download_url'>

type GalleryRowProps = {
  photo: GalleryRowPhoto
  isSelected?: boolean
  onSelectPhoto: (photo: GalleryRowPhoto) => void
}

export function GalleryRow({ photo, isSelected = false, onSelectPhoto }: GalleryRowProps) {
  const thumbnailUrl = buildPicsumImageUrl({
    source: { kind: 'id', id: photo.id },
    width: 160,
    height: 120,
    effects: { grayscale: false, blur: false },
  })

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelectPhoto(photo)}
    >
      <img src={thumbnailUrl} alt={photo.author} />
      <span>{photo.id}</span>
      <span>{photo.author}</span>
    </button>
  )
}
