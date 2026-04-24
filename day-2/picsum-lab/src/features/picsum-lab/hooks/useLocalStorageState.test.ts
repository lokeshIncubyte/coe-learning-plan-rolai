import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
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
  beforeEach(() => {
    const storage = new Map<string, string>()

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value)
        },
        removeItem: (key: string) => {
          storage.delete(key)
        },
        clear: () => {
          storage.clear()
        },
      },
    })
  })

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

    expect(result.current[0]).toEqual(stored.data)
  })

  it('returns a setter function as the second tuple entry', () => {
    const key = 'picsum-lab-prefs-tuple'
    const defaults: PrefsData = { width: 400, height: 300 }

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

    expect(typeof result.current[1]).toBe('function')
  })

  it('returns defaults when localStorage contains invalid JSON', () => {
    const key = 'picsum-lab-prefs-invalid'
    const defaults: PrefsData = { width: 400, height: 300 }

    localStorage.setItem(key, '{invalid-json')

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

    expect(() =>
      renderHook(() => useLocalStorageState<PrefsData>(key, defaults, validateStoredPrefs)),
    ).not.toThrow()

    const { result } = renderHook(() =>
      useLocalStorageState<PrefsData>(key, defaults, validateStoredPrefs),
    )

    expect(result.current[0]).toEqual(defaults)
  })
})
