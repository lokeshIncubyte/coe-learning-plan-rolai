# Architecture

**Schemas**: [Remote API](./schema-remote.md), [Application](./schema-app.md).

---

## Layers

```text
Components (JSX, props, events)
  → Hooks (gallery load, selection, optional prefs)
      → Domain (types, guards, buildPicsumImageUrl)
          → Infrastructure (fetch helper, localStorage)
```

- Presentational leaves do not call **`fetch`** or read **`localStorage`** directly.
- External text becomes **`unknown`** at the boundary, then passes through guards.

---

## Folder structure

```text
src/
  app/
    App.tsx
  features/
    picsum-lab/
      model/
        types.ts
        guards.ts
        buildPicsumImageUrl.ts
      lib/
        fetchJson.ts
      hooks/
        usePicsumGallery.ts
        usePicsumLabState.ts
        useLocalStorageState.ts
      components/
        PicsumLabPage.tsx
        Gallery.tsx
        GalleryRow.tsx
        Preview.tsx
        Controls.tsx
      index.ts
```

---

## Component responsibilities

| Component | Role |
|-----------|------|
| `PicsumLabPage` | Composes gallery, preview, controls; may own orchestration hook. |
| `Gallery` | Renders list; receives `photos`, `selectedPhotoId`, `onSelectPhoto`. |
| `GalleryRow` | One row; receives `onSelectPhoto(photo)` from `Gallery`. |
| `Preview` | `<img src={url} />` where `url` comes from `buildPicsumImageUrl`. |
| `Controls` | Width, height, effects; emits change callbacks. |

---

## Data flow

**Gallery load**

```text
mount → usePicsumGallery
  → fetch list → parse as unknown → isPicsumListPayload
  → update GalleryFetchState (success | error)
```

**Preview**

```text
selection + dimensions + effects
  → buildPicsumImageUrl({ source, width, height, effects })
  → Preview updates src
```

**Optional persistence**

```text
state change → effect → serialize StoredPicsumLabPrefsV1
mount → read → parse unknown → isStoredPicsumLabPrefsV1 → merge into state
```

---

[← Index](../README.md)
