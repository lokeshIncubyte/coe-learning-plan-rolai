import { describe, expect, it } from 'vitest'
import { isStoredPicsumLabPrefsV1 } from './guards'

describe('isStoredPicsumLabPrefsV1', () => {
  it('rejects a blob whose data is missing selectedPhotoId', () => {
    const candidate = {
      version: 1,
      savedAt: '2026-01-01T00:00:00.000Z',
      data: { width: 640, height: 480 },
    }

    expect(isStoredPicsumLabPrefsV1(candidate)).toBe(false)
  })
})
