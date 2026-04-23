import type { PicsumListResponse, PicsumPhoto, StoredPicsumLabPrefsV1 } from './types'

export function isPicsumPhoto(value: unknown): value is PicsumPhoto {
  if (value === null || typeof value !== 'object') {
    return false
  }

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'author' in value &&
    typeof value.author === 'string' &&
    'width' in value &&
    typeof value.width === 'number' &&
    'height' in value &&
    typeof value.height === 'number' &&
    'url' in value &&
    typeof value.url === 'string' &&
    'download_url' in value &&
    typeof value.download_url === 'string'
  )
}

export function isPicsumListPayload(value: unknown): value is PicsumListResponse {
  return Array.isArray(value) && value.every((item) => isPicsumPhoto(item))
}

export function isStoredPicsumLabPrefsV1(value: unknown): value is StoredPicsumLabPrefsV1 {
  if (value === null || typeof value !== 'object') {
    return false
  }

  return (
    'version' in value &&
    value.version === 1 &&
    'savedAt' in value &&
    typeof value.savedAt === 'string' &&
    'data' in value &&
    typeof value.data === 'object' &&
    value.data !== null &&
    'width' in value.data &&
    typeof value.data.width === 'number' &&
    'height' in value.data &&
    typeof value.data.height === 'number'
  )
}
