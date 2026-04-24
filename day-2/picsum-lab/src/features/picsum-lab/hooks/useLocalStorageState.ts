import { useCallback, useState } from 'react'

type StoredWithData<T> = {
  data: T
}

export function useLocalStorageState<T, TStored extends StoredWithData<T>>(
  key: string,
  defaults: T,
  validate: (value: unknown) => value is TStored,
): readonly [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    if (raw === null) {
      return defaults
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return defaults
    }

    if (!validate(parsed)) {
      return defaults
    }

    return parsed.data
  })

  const persist = useCallback(
    (next: T) => {
      const envelope = {
        version: 1,
        savedAt: new Date().toISOString(),
        data: next,
      }
      localStorage.setItem(key, JSON.stringify(envelope))
      setValue(next)
    },
    [key],
  )

  return [value, persist] as const
}
