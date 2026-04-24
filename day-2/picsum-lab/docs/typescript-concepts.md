# TypeScript + React Concepts Used in Picsum Lab

Maps the **TypeScript Advanced & React Basics** learning goals to where each concept actually lives in the `picsum-lab` codebase. All paths are relative to `day-2/picsum-lab/`.

---

## 1. Generics

### Custom generic hook

[`src/features/picsum-lab/hooks/useLocalStorageState.ts`](../src/features/picsum-lab/hooks/useLocalStorageState.ts)

```ts
type StoredWithData<T> = { data: T }

export function useLocalStorageState<T, TStored extends StoredWithData<T>>(
  key: string,
  defaults: T,
  validate: (value: unknown) => value is TStored,
): readonly [T, (next: T) => void]
```

Two type parameters; `TStored` is constrained (`extends`) so the hydrated envelope is guaranteed to contain a `data: T` field. The return type is a `readonly` tuple — the same shape React's own `useState` returns.

### Generic fetch helper

[`src/features/picsum-lab/lib/fetchJson.ts`](../src/features/picsum-lab/lib/fetchJson.ts)

```ts
export async function fetchJson<T>(
  url: string,
  validator: (data: unknown) => data is T,
): Promise<T | null>
```

`T` is inferred from the validator. Callers get back a typed value or `null` without `any` leaking.

### Consuming React's built-in generics

[`src/features/picsum-lab/hooks/usePicsumGallery.ts`](../src/features/picsum-lab/hooks/usePicsumGallery.ts)

```ts
const [state, setState] = useState<GalleryFetchState>({ status: 'loading' })
```

[`src/features/picsum-lab/hooks/useLocalStorageState.ts`](../src/features/picsum-lab/hooks/useLocalStorageState.ts)

```ts
const [value, setValue] = useState<T>(() => { ... })
```

---

## 2. Utility types

| Utility | Where |
|---------|-------|
| `Pick<PicsumPhoto, 'id' \| 'author' \| 'download_url'>` | [`components/Gallery.tsx`](../src/features/picsum-lab/components/Gallery.tsx) — row-level props don't need the full photo |
| `NonNullable<ImageEffects['blurAmount']>` | [`model/toBlurAmount.ts`](../src/features/picsum-lab/model/toBlurAmount.ts) — strips `undefined` off the optional `blurAmount` |
| Indexed-access `ImageEffects['blurAmount']` | same file — drills into a property's type |
| `Partial<StoredPrefsV1>` | [`hooks/useLocalStorageState.test.ts`](../src/features/picsum-lab/hooks/useLocalStorageState.test.ts) — lets the validator poke at fields that may or may not exist |
| `Promise<T \| null>` | [`lib/fetchJson.ts`](../src/features/picsum-lab/lib/fetchJson.ts) — standard lib generic around the async result |
| `ChangeEvent<HTMLInputElement>` | [`components/Controls.tsx`](../src/features/picsum-lab/components/Controls.tsx) — React's own generic event type |
| `Response` | [`components/PicsumLabPage.integration.test.tsx`](../src/features/picsum-lab/components/PicsumLabPage.integration.test.tsx) — mock casts via `as Response` |

---

## 3. Type guards and narrowing

### User-defined type guards (`value is T`)

[`src/features/picsum-lab/model/guards.ts`](../src/features/picsum-lab/model/guards.ts)

```ts
export function isPicsumPhoto(value: unknown): value is PicsumPhoto { ... }
export function isPicsumListPayload(value: unknown): value is PicsumListResponse { ... }
export function isStoredPicsumLabPrefsV1(value: unknown): value is StoredPicsumLabPrefsV1 { ... }
```

Each one narrows `unknown` coming off a boundary (`response.json()` or `localStorage.getItem`) into a typed value using `typeof`, `'key' in value`, and nested checks. The signatures make downstream code type-safe without casts.

### Discriminated-union narrowing

Two unions drive the UI and the URL builder:

[`src/features/picsum-lab/model/types.ts`](../src/features/picsum-lab/model/types.ts)

```ts
export type GalleryFetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; photos: PicsumPhoto[] }
  | { status: 'error'; message: string }

export type ImageSource =
  | { kind: 'id'; id: string }
  | { kind: 'seed'; seed: string }
```

Consumers narrow on the discriminant and TypeScript gives them only the fields valid for that variant:

[`components/PicsumLabPage.tsx`](../src/features/picsum-lab/components/PicsumLabPage.tsx)

```tsx
{galleryState.status === 'success' && (
  <Gallery photos={galleryState.photos} /* photos exists only in this branch */ />
)}
{galleryState.status === 'error' && <p role="alert">{galleryState.message}</p>}
```

### Exhaustiveness check with `never`

[`model/buildPicsumImageUrl.ts`](../src/features/picsum-lab/model/buildPicsumImageUrl.ts)

```ts
switch (source.kind) {
  case 'id': ...
  case 'seed': ...
  default: {
    const _exhaustiveCheck: never = source
    return _exhaustiveCheck
  }
}
```

If a new variant is added to `ImageSource` and this switch isn't updated, `source` won't be assignable to `never` and the compiler fails. This is how we caught unhandled kinds during the `random` removal.

---

## 4. Literal and union types

- `blurAmount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10` — numeric literal union in [`types.ts`](../src/features/picsum-lab/model/types.ts). The `toBlurAmount` helper exists solely to assert into this union after clamping.
- `version: 1` — literal type pinning the stored-prefs envelope to a specific version.
- `string | null` — nullable id type used in `PicsumLabPrefsData.selectedPhotoId`.

---

## 5. async/await and Promises

[`src/features/picsum-lab/lib/fetchJson.ts`](../src/features/picsum-lab/lib/fetchJson.ts)

```ts
export async function fetchJson<T>(
  url: string,
  validator: (data: unknown) => data is T,
): Promise<T | null> {
  const response = await fetch(url)
  const payload: unknown = await response.json()
  if (!validator(payload)) return null
  return payload
}
```

External JSON is typed as `unknown` right after `.json()` — nothing can touch it until a guard narrows it.

[`src/features/picsum-lab/hooks/usePicsumGallery.ts`](../src/features/picsum-lab/hooks/usePicsumGallery.ts)

```ts
const loadGallery = async () => {
  try {
    const photos = await fetchJson('https://picsum.photos/v2/list', isPicsumListPayload)
    if (!photos) { setState(toErrorState('Invalid gallery payload')); return }
    setState({ status: 'success', photos })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setState(toErrorState(message))
  }
}
void loadGallery()
```

Key patterns:
- `try`/`catch` around every `await` that can reject.
- `error instanceof Error` narrows the `unknown` thrown value before reading `.message`.
- `void loadGallery()` deliberately discards the returned promise inside a `useEffect` callback (effects can't be `async`).

---

## 6. React fundamentals with TypeScript

### Functional components with typed props

[`src/features/picsum-lab/components/Controls.tsx`](../src/features/picsum-lab/components/Controls.tsx)

```tsx
type ControlsProps = {
  width?: number
  height?: number
  grayscale?: boolean
  blur?: boolean
  blurAmount?: number
  onWidthChange: (width: number) => void
  onHeightChange?: (height: number) => void
  ...
}

export function Controls({ width, height, ... }: ControlsProps) { ... }
```

Callbacks are declared as function-type fields (`(x: T) => void`) rather than `Function`, so misuse fails at the call site.

### `useState` and `useEffect`

- `useState` used generically in [`usePicsumGallery.ts`](../src/features/picsum-lab/hooks/usePicsumGallery.ts) and [`useLocalStorageState.ts`](../src/features/picsum-lab/hooks/useLocalStorageState.ts).
- `useEffect` for the initial fetch ([`usePicsumGallery.ts`](../src/features/picsum-lab/hooks/usePicsumGallery.ts)) and for reconciling a stale persisted `selectedPhotoId` against the loaded gallery ([`PicsumLabPage.tsx`](../src/features/picsum-lab/components/PicsumLabPage.tsx)).
- `useCallback` to stabilise the persisted setter identity in [`useLocalStorageState.ts`](../src/features/picsum-lab/hooks/useLocalStorageState.ts).

### Custom hooks with typed return shapes

- `usePicsumGallery(): GalleryFetchState` — returns a discriminated union.
- `useLocalStorageState(...): readonly [T, (next: T) => void]` — returns a tuple compatible with array destructuring.

### Component composition and prop drilling

`PicsumLabPage` → `Gallery` → `GalleryRow`:

- `Gallery` receives `photos`, `selectedPhotoId`, `onSelectPhoto`.
- `Gallery` narrows each `PicsumPhoto` down to a `Pick<…>` before handing it to `GalleryRow`.
- `GalleryRow` emits the full photo back up via its `onSelectPhoto` prop — the page owns selection state, rows are pure visual/behaviour leaves.

`Controls` is entirely presentational — all values come in as props, all changes go out as callbacks, and `PicsumLabPage` is the single place where `setPrefs` is called.

---

## 7. Smaller TypeScript touches

- **`readonly` tuples** — `as const` on the tuple returned by `useLocalStorageState` prevents callers from accidentally swapping setter with value.
- **`satisfies`** wasn't needed here, but `as const` is used to pin the returned tuple.
- **`type` over `interface`** — consistent across the codebase; unions and intersections keep things declarative.
- **Boundary typing** — every piece of external data (`fetch` response, `localStorage.getItem`) is declared `unknown` and only becomes typed after a guard.
- **Path-based module imports** — `import type { ImageEffects } from './types'` for pure-type imports (elided at build time).

---

## Success-criteria cross-check

| Criterion | Evidence |
|-----------|----------|
| Uses TypeScript generics correctly | `useLocalStorageState<T, TStored>`, `fetchJson<T>`, `useState<T>` call sites |
| Applies utility types appropriately | `Pick`, `NonNullable`, indexed access, `Partial`, `Promise<T>`, `ChangeEvent<T>` |
| Handles async operations with proper typing | `fetchJson` returns `Promise<T \| null>`; `usePicsumGallery` try/catch with `instanceof Error` narrowing |
| Creates React functional components | `PicsumLabPage`, `Gallery`, `GalleryRow`, `Controls`, `Preview` |
| Uses `useState` and `useEffect` hooks | `useState` in hooks; `useEffect` for fetch + reconciliation |
| Types React components properly | Every component has a typed `Props` alias; events use `ChangeEvent<HTMLInputElement>` |
| Builds counter / todo exercises | Out of scope for this project — the picsum-lab app itself exercises the same primitives at greater depth |
| Pushes React + TypeScript app to GitHub | Repo history on `main` |

---

[← Index](../README.md)
