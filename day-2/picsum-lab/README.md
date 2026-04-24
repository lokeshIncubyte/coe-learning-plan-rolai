# Picsum Lab

A small React + TypeScript app that loads a gallery from the [Lorem Picsum](https://picsum.photos/) API, lets the user pick a photo, and shows a preview that can be resized and rendered with grayscale and blur effects. Preferences (selection, dimensions, effects) persist to `localStorage`.

Built with TDD, one behavior per commit. The full execution log lives in [`TDD-DETAILED-STEPS.md`](./TDD-DETAILED-STEPS.md).

---

## Quick start

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # watch mode; append --run for a single pass
npm run build
```

---

## Docs index

| Doc | Purpose |
|-----|---------|
| [architecture.md](./architecture.md) | Layer boundaries, folder layout, data flow |
| [user-stories.md](./user-stories.md) | A–E user stories (first open, select, change, reload, error) |
| [schema-remote.md](./schema-remote.md) | Picsum API shapes (`/v2/list`, `/id/{id}/info`, image URL patterns) |
| [schema-app.md](./schema-app.md) | In-app types, guards, persisted prefs shape |
| [TDD-DETAILED-STEPS.md](./TDD-DETAILED-STEPS.md) | Full TDD execution log (phases 1 and 2) |

---

## Feature surface

- Gallery load with loading state and error fallback
- Photo selection; first photo auto-selected on fresh sessions
- Controlled width, height, grayscale, blur, and blur amount (1–10)
- Preferences persist across reload via a versioned `localStorage` envelope
- Stale persisted selections reconcile to the first photo on the next load
- Two-column layout: gallery grid on the left (independently scrollable), preview + controls on the right
