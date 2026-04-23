import type { BuildImageUrlInput } from './types'
import { buildEffectsQuery } from './buildEffectsQuery'

const PICSUM_BASE_URL = 'https://picsum.photos'

export function buildPicsumImageUrl(input: BuildImageUrlInput): string {
  const { source, width, height, effects, randomNonce } = input
  const effectsQuery = buildEffectsQuery(effects)
  const randomQuery =
    typeof randomNonce === 'number' && randomNonce > 0 ? `random=${randomNonce}` : ''
  const query = randomQuery
    ? effectsQuery
      ? `${effectsQuery}&${randomQuery}`
      : `?${randomQuery}`
    : effectsQuery

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
