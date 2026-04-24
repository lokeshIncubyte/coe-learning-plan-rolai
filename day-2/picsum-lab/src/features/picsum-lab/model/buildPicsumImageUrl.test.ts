import { describe, expect, it } from 'vitest'
import { buildPicsumImageUrl } from './buildPicsumImageUrl'

describe('buildPicsumImageUrl', () => {
  it('returns id-based URL with width and height', () => {
    const url = buildPicsumImageUrl({
      source: { kind: 'id', id: '0' },
      width: 400,
      height: 300,
      effects: {
        grayscale: false,
        blur: false,
      },
    })

    expect(url).toBe('https://picsum.photos/id/0/400/300')
  })

  it('appends grayscale query param when grayscale effect is enabled', () => {
    const url = buildPicsumImageUrl({
      source: { kind: 'id', id: '0' },
      width: 400,
      height: 300,
      effects: {
        grayscale: true,
        blur: false,
      },
    })

    expect(url).toContain('?grayscale')
  })

  it('appends blur query param when blur effect is enabled without amount', () => {
    const url = buildPicsumImageUrl({
      source: { kind: 'id', id: '0' },
      width: 400,
      height: 300,
      effects: {
        grayscale: false,
        blur: true,
      },
    })

    expect(url).toContain('?blur')
  })

  it('appends blur amount query param when blur effect is enabled with amount', () => {
    const url = buildPicsumImageUrl({
      source: { kind: 'id', id: '0' },
      width: 400,
      height: 300,
      effects: {
        grayscale: false,
        blur: true,
        blurAmount: 5,
      },
    })

    expect(url).toContain('?blur=5')
  })

  it('defaults blur amount to 1 when blur is on without an explicit amount', () => {
    const url = buildPicsumImageUrl({
      source: { kind: 'id', id: '0' },
      width: 400,
      height: 300,
      effects: {
        grayscale: false,
        blur: true,
      },
    })

    expect(url).toContain('blur=1')
  })

  it('includes both grayscale and blur query params when both effects are enabled', () => {
    const url = buildPicsumImageUrl({
      source: { kind: 'id', id: '0' },
      width: 400,
      height: 300,
      effects: {
        grayscale: true,
        blur: true,
      },
    })

    expect(url).toContain('grayscale')
    expect(url).toContain('blur')
  })
})
