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
