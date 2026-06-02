# Application schema (not from Picsum JSON)

Types and validation used inside the app. **Remote shapes**: [Remote API schema](./schema-remote.md).

---

## Image source

```ts
type ImageSource =
  | { kind: 'id'; id: string }
  | { kind: 'seed'; seed: string };
```

---

## Render / effect options

```ts
type ImageEffects = {
  grayscale: boolean;
  blur: boolean;
  blurAmount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};
```

---

## URL builder input

```ts
type BuildImageUrlInput = {
  source: ImageSource;
  width: number;
  height: number;
  effects: ImageEffects;
};
```

---

## UI state (conceptual)

```ts
type GalleryFetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; photos: PicsumPhoto[] }
  | { status: 'error'; message: string };

type PicsumLabUiState = {
  selectedPhotoId: string | null;
  width: number;
  height: number;
  effects: ImageEffects;
  gallery: GalleryFetchState;
};
```

`GalleryFetchState` and `ImageSource` are **discriminated unions**: rendering and URL logic narrow on **`status`** and **`kind`** respectively.

---

## Optional persisted preferences

Versioned blob; after `JSON.parse`, treat as **`unknown`** and validate before use.

```ts
type StoredPicsumLabPrefsV1 = {
  version: 1;
  savedAt: string; // ISO 8601
  data: {
    selectedPhotoId: string | null;
    width: number;
    height: number;
    effects: ImageEffects;
  };
};
```

---

## Type predicates (guards)

| Function | Purpose |
|----------|---------|
| `isPicsumPhoto(value: unknown): value is PicsumPhoto` | One API object. |
| `isPicsumListPayload(value: unknown): value is PicsumListResponse` | Array; each element satisfies `isPicsumPhoto`. |
| `isStoredPicsumLabPrefsV1(value: unknown): value is StoredPicsumLabPrefsV1` | Persisted prefs envelope, if used. |

`isPicsumPhoto` composes **object** checks, **`in`** for keys, and **`typeof`** on each primitive field so properties are not read from non-objects.

---

## Cross-cutting implementation notes

- **Parsing**: A small **`fetchJson(url, validator)`** can take a validator `(data: unknown) => data is T` and return typed `T` after a successful parse.
- **Persistence hook**: Optional **`useLocalStorageState<T>`** reads/writes serialized values; on read, validate with a guard before state merge.
- **Derived props**: List rows may take **`Pick<PicsumPhoto, 'id' | 'author' | 'download_url'>`** (or similar) instead of the full entity.
- **Presets**: Fixed size shortcuts can use **`Record<PresetName, readonly [number, number]>`** with **`as const`** for keys; **`satisfies`** can pin literal types to that map.
- **Network errors**: Gallery loading wraps **`fetch`** / parse in **`try` / `catch`** and maps failures into `GalleryFetchState`’s `error` variant.
- **React**: Components use typed props; inputs use `React.ChangeEvent<HTMLInputElement>` (and related) where applicable. See [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/).

---

[← Index](../README.md)
