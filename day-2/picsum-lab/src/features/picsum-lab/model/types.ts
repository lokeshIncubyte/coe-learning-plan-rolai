export type PicsumPhoto = {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export type PicsumListResponse = PicsumPhoto[]

export type GalleryFetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; photos: PicsumPhoto[] }
  | { status: 'error'; message: string }

export type ImageSource =
  | { kind: 'id'; id: string }
  | { kind: 'seed'; seed: string }

export type ImageEffects = {
  grayscale: boolean
  blur: boolean
  blurAmount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

export type BuildImageUrlInput = {
  source: ImageSource
  width: number
  height: number
  effects: ImageEffects
}

export type PicsumLabPrefsData = {
  width: number
  height: number
  selectedPhotoId: string | null
}

export type StoredPicsumLabPrefsV1 = {
  version: 1
  savedAt: string
  data: PicsumLabPrefsData
}
