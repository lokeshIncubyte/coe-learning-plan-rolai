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
})
