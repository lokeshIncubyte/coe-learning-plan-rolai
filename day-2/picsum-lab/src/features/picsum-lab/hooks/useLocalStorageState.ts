import { useMemo } from 'react'

type StoredWithData<T> = {
  data: T
}

export function useLocalStorageState<T, TStored extends StoredWithData<T>>(
  key: string,
  defaults: T,
  validate: (value: unknown) => value is TStored,
): T {
  return useMemo(() => {
    const raw = localStorage.getItem(key)
    if (raw === null) {
      return defaults
    }

    const parsed: unknown = JSON.parse(raw)
    if (!validate(parsed)) {
      return defaults
    }

    return parsed.data
  }, [defaults, key, validate])
}
