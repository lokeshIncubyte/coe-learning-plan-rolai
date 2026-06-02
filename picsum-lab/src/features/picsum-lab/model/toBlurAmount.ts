import type { ImageEffects } from './types'

type BlurAmount = NonNullable<ImageEffects['blurAmount']>

export function toBlurAmount(value: number): BlurAmount {
  const rounded = Math.round(value)
  const clamped = Math.min(10, Math.max(1, rounded))
  return clamped as BlurAmount
}
