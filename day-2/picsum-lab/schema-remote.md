# Remote API schema (Picsum)

Verified against live JSON from `GET https://picsum.photos/v2/list?limit=2` and `GET https://picsum.photos/id/0/info`.

**Related**: [Application schema](./schema-app.md) (`ImageSource`, `buildPicsumImageUrl` inputs).

---

## `GET /v2/list`

| Item | Detail |
|------|--------|
| **URL** | `https://picsum.photos/v2/list` |
| **Query** | `page`, `limit` (e.g. `?limit=12`). Pagination may appear in **`Link`** response headers. |
| **Response body** | JSON **array** of photo objects (top-level `[...]`, not wrapped in an object). |

**Element shape** — each array item:

| Field | JSON | TypeScript | Notes |
|-------|------|------------|--------|
| `id` | string | `string` | e.g. `"0"` (not a JSON number). |
| `author` | string | `string` | |
| `width` | number | `number` | Native pixel width. |
| `height` | number | `number` | Native pixel height. |
| `url` | string | `string` | Unsplash **page** URL, not the raw image bytes. |
| `download_url` | string | `string` | Picsum **image** URL at **native** `width` × `height`. |

```ts
/** One object from GET /v2/list or GET /id/{id}/info */
type PicsumPhoto = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

/** Parsed body of GET /v2/list */
type PicsumListResponse = PicsumPhoto[];
```

Example:

```json
{
  "id": "0",
  "author": "Alejandro Escamilla",
  "width": 5000,
  "height": 3333,
  "url": "https://unsplash.com/photos/yC-Yzbqy7PY",
  "download_url": "https://picsum.photos/id/0/5000/3333"
}
```

**Runtime validation**: After `JSON.parse` or `response.json()`, treat the value as **`unknown`**. Narrow with **`Array.isArray`** for the list, then validate each element as an object (`value !== null && typeof value === 'object'`), use **`in`** for expected keys, and **`typeof`** per field (`string` / `number`) before treating the payload as `PicsumListResponse`.

---

## `GET /id/{id}/info`

| Item | Detail |
|------|--------|
| **URL** | `https://picsum.photos/id/{id}/info` |
| **Response** | Single JSON object — **same six fields** as `PicsumPhoto`. |

Same validation approach as a single list element.

---

## Image URL (binary) — constructed in the app

Used for `<img src>` when display size and effects differ from native dimensions. Patterns from [picsum.photos](https://picsum.photos/):

- **By id**: `https://picsum.photos/id/{id}/{width}/{height}`
- **By seed**: `https://picsum.photos/seed/{seed}/{width}/{height}`
- **Random** (no id in path): `https://picsum.photos/{width}/{height}`

**Query parameters** (combinable per docs):

- `?grayscale`
- `?blur` or `?blur=1` … `?blur=10`
- `?random={n}` to reduce caching when reloading the same dimensions

`download_url` on `PicsumPhoto` is valid at **native** size; the preview URL is usually **built** when width, height, or effects change.

**URL builder**: Implement `buildPicsumImageUrl` as a pure function over **`ImageSource`** ([application schema](./schema-app.md#image-source)). Narrow **`source.kind`** with **`switch`** or **`if`** so each variant produces the correct path segment.

---

[← Index](./README.md)
