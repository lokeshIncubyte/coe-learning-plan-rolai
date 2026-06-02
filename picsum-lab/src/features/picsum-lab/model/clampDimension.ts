const MIN_DIMENSION = 1

export function clampDimension(value: number): number {
  return Number.isFinite(value) ? Math.max(MIN_DIMENSION, value) : MIN_DIMENSION
}
