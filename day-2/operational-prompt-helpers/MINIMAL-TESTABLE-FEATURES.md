# Picsum Lab — Minimal Testable Features

This breaks the project into the smallest practical slices you can build and verify one by one.

---

## Feature 0: App shell boots

**Goal**
- Render a page title and empty sections: Gallery, Controls, Preview.

**Done when**
- App starts with no runtime/type errors.
- You can see placeholders for all 3 sections.

**Quick test**
- Run app, confirm sections render.

---

## Feature 1: Fetch gallery list

**Goal**
- Call `GET https://picsum.photos/v2/list?limit=12` and store results.

**Done when**
- Loading state appears while request is in flight.
- Success state stores array of photos.
- Error state shows a message if request fails.

**Quick test**
- With network on: list loads.
- With network off: error state is visible.

---

## Feature 2: Validate API payload

**Goal**
- Parse JSON as `unknown`, validate with guards (`isPicsumPhoto`, `isPicsumListPayload`).

**Done when**
- Invalid payload does not crash app.
- Invalid payload transitions to error state.

**Quick test**
- Temporarily mock invalid response shape and verify fallback to error.

---

## Feature 3: Render gallery rows

**Goal**
- Show list rows with minimal fields (id + author).

**Done when**
- All fetched items render as clickable rows.
- Selected row has visible state.

**Quick test**
- Click different rows and confirm selection changes.

---

## Feature 4: Build preview URL by selected `id`

**Goal**
- Add `buildPicsumImageUrl` for `ImageSource = { kind: 'id'; id }`.

**Done when**
- Selecting a row updates preview image src.
- URL format is `https://picsum.photos/id/{id}/{width}/{height}`.

**Quick test**
- Select 2 different rows; preview image changes each time.

---

## Feature 5: Add size controls

**Goal**
- Add width/height inputs that update preview.

**Done when**
- Width/height updates regenerate preview URL.
- Non-positive values are clamped or rejected consistently.

**Quick test**
- Change width/height and verify new image dimensions in URL.

---

## Feature 6: Add effects controls

**Goal**
- Add grayscale toggle, blur toggle, blur amount (1..10).

**Done when**
- Query params append correctly:
  - `?grayscale`
  - `?blur`
  - `?blur=n`
- Turning effects off removes those params.

**Quick test**
- Toggle each control and inspect preview URL.

---

## Feature 7: Add optional random cache-bust

**Goal**
- Support `?random={n}` in URL generation.

**Done when**
- Clicking a refresh/random button changes `randomNonce`.
- Image URL query includes updated `random`.

**Quick test**
- Click refresh twice; URL nonce changes each time.

---

## Feature 8: Optional source variants

**Goal**
- Support `ImageSource` union variants:
  - `{ kind: 'seed'; seed }`
  - `{ kind: 'random' }`

**Done when**
- URL builder narrows on `source.kind` and returns correct path for each variant.

**Quick test**
- Switch source mode and verify path pattern changes.

---

## Feature 9: Persist preferences (optional)

**Goal**
- Save selected id + controls to localStorage; hydrate on reload.

**Done when**
- Refresh restores valid saved state.
- Corrupt JSON safely falls back to defaults.

**Quick test**
- Set preferences, refresh, verify restored values.
- Manually break storage value, refresh, verify safe fallback.

---

## Feature 10: Final integration pass

**Goal**
- Confirm all flows work together.

**Done when**
- First open flow works.
- Select + controls flow works.
- Error flow works.
- Optional persistence flow works (if implemented).

**Quick test checklist**
- [ ] App boots
- [ ] Gallery loads
- [ ] Invalid payload handled
- [ ] Selection updates preview
- [ ] Size/effects update URL
- [ ] Error state visible on fetch failure
- [ ] (Optional) prefs persist across reload

