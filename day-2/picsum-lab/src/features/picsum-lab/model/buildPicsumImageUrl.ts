import type { BuildImageUrlInput } from './types'

const PICSUM_BASE_URL = 'https://picsum.photos'

export function buildPicsumImageUrl(input: BuildImageUrlInput): string {
  const { source, width, height, effects } = input
  const queryParts: string[] = []
  if (effects.grayscale) {
    queryParts.push('grayscale')
  }
  if (effects.blur) {
    queryParts.push(effects.blurAmount ? `blur=${effects.blurAmount}` : 'blur')
  }
  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : ''

  switch (source.kind) {
    case 'id':
      return `${PICSUM_BASE_URL}/id/${source.id}/${width}/${height}${query}`
    case 'seed':
      return `${PICSUM_BASE_URL}/seed/${source.seed}/${width}/${height}${query}`
    case 'random':
      return `${PICSUM_BASE_URL}/${width}/${height}${query}`
    default: {
      const _exhaustiveCheck: never = source
      return _exhaustiveCheck
    }
  }
}
