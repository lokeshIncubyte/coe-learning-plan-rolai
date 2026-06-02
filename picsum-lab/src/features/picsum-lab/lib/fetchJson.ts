export async function fetchJson<T>(
  url: string,
  validator: (data: unknown) => data is T,
): Promise<T | null> {
  const response = await fetch(url)
  const payload: unknown = await response.json()

  if (!validator(payload)) {
    return null
  }

  return payload
}
