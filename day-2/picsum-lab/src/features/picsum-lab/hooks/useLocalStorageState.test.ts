import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLocalStorageState } from './useLocalStorageState'

type PrefsData = {
  width: number
  height: number
}

type StoredPrefsV1 = {
  version: 1
  savedAt: string
  data: PrefsData
}

describe('useLocalStorageState', () => {
  it('returns stored data when localStorage contains a valid StoredPrefsV1 blob', () => {
    const key = 'picsum-lab-prefs'
    const defaults: PrefsData = { width: 400, height: 300 }
    const stored: StoredPrefsV1 = {
      version: 1,
      savedAt: '2026-01-01T00:00:00.000Z',
      data: { width: 640, height: 480 },
    }

    localStorage.setItem(key, JSON.stringify(stored))

    const validateStoredPrefs = (value: unknown): value is StoredPrefsV1 => {
      if (typeof value !== 'object' || value === null) {
        return false
      }

      const candidate = value as Partial<StoredPrefsV1>
      return (
        candidate.version === 1 &&
        typeof candidate.savedAt === 'string' &&
        typeof candidate.data?.width === 'number' &&
        typeof candidate.data?.height === 'number'
      )
    }

    const { result } = renderHook(() =>
      useLocalStorageState<PrefsData>(key, defaults, validateStoredPrefs),
    )

    expect(result.current).toEqual(stored.data)
  })
})
