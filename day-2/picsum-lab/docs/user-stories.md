# User stories

**Context**: [Architecture](./architecture.md), [schemas](../README.md).

---

## A — First open

1. User opens the app.
2. Gallery shows a loading state.
3. App requests `/v2/list`, validates the payload, then shows the list or an error.
4. Preview may stay empty until a photo is selected, or the first row may be selected by default (product choice).

---

## B — Select a photo

1. User activates a gallery row.
2. Selection state updates (`selectedPhotoId` or a full `PicsumPhoto`).
3. Preview requests the image using the current width, height, and effects.

---

## C — Change size or effects

1. User changes width, height, grayscale, blur, or blur level.
2. Controls update shared state.
3. `buildPicsumImageUrl` runs again; the preview image updates.

Invalid dimensions (e.g. non-positive) are clamped or rejected in one place (hook or builder); behavior should stay consistent.

---

## D — Reload with saved preferences

1. User returns after a previous visit with `localStorage` enabled.
2. Saved prefs load and merge into state when valid.
3. If the stored id is missing from the new list, selection falls back (none or first item).

Corrupt or invalid stored JSON should fall back to defaults without crashing.

---

## E — Gallery request fails

1. Network failure or unreadable response.
2. State becomes the `error` variant with a message.
3. UI shows the failure; preview does not imply a successful load.

---

[← Index](../README.md)
