import { describe, expect, it } from 'vitest'
import { clampDimension } from './clampDimension'

describe('clampDimension', () => {
  it('returns 1 when input is 0', () => {
    expect(clampDimension(0)).toBe(1)
  })
})
