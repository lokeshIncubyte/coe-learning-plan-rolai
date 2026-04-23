import type { BuildImageUrlInput } from './types'

const PICSUM_BASE_URL = 'https://picsum.photos'

export function buildPicsumImageUrl(input: BuildImageUrlInput): string {
  const { source, width, height, effects } = input
  const grayscaleQuery = effects.grayscale ? '?grayscale' : ''

  switch (source.kind) {
    case 'id':
      return `${PICSUM_BASE_URL}/id/${source.id}/${width}/${height}${grayscaleQuery}`
    case 'seed':
      return `${PICSUM_BASE_URL}/seed/${source.seed}/${width}/${height}${grayscaleQuery}`
    case 'random':
      return `${PICSUM_BASE_URL}/${width}/${height}${grayscaleQuery}`
    default: {
      const _exhaustiveCheck: never = source
      return _exhaustiveCheck
    }
  }
}
