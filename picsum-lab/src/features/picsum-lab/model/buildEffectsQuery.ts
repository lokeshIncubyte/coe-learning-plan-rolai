import type { ImageEffects } from './types'

export function buildEffectsQuery(effects: ImageEffects): string {
  const queryParts: string[] = []

  if (effects.grayscale) {
    queryParts.push('grayscale')
  }

  if (effects.blur) {
    queryParts.push(`blur=${effects.blurAmount ?? 1}`)
  }

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : ''
}
