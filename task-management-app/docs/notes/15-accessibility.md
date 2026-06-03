# 15. Accessibility Basics

## What it is

Accessibility (a11y) means building UIs that work for everyone — people using keyboards, screen readers, switch devices, or high-contrast displays. Most of what it requires is not exotic: use the right HTML element, label interactive things, make focus visible.

Four areas that cover the majority of common failures:

1. **Semantic HTML** — using the element whose built-in meaning matches the job
2. **ARIA attributes** — communicating state and role to assistive technology when HTML alone is not enough
3. **Keyboard navigation** — every interactive element reachable and operable without a pointer
4. **Visible focus rings** — making keyboard focus obvious on screen

## Semantic HTML

A `<button>` is keyboard focusable, activatable with Enter/Space, and announced as "button" by screen readers — for free. A `<div onClick>` gives you none of that. Use the right element and you get the right behaviour without writing extra code.

## ARIA attributes

ARIA bridges the gap when HTML semantics are not enough. Three patterns this project uses:

**`aria-label`** — names a control that has no visible text label. On `components/DeleteTaskButton.tsx`, the button text is just "Delete", but the label is explicit:

```tsx
<button
  type="button"
  aria-label="Delete task"
  onClick={() => setConfirming(true)}
  …
>
  Delete
</button>
```

A screen reader user navigating by button hears "Delete task, button" rather than an ambiguous "Delete".

**`aria-pressed`** — communicates a toggle button's current state. In `components/ThemeToggle.tsx`:

```tsx
<button
  type="button"
  aria-label="Toggle dark mode"
  aria-pressed={isDark}
  …
>
```

Screen readers announce "Toggle dark mode, button, pressed" or "not pressed" depending on the current theme.

**`role` + `aria-busy` + `aria-label`** on loading regions — in `components/TaskListSkeleton.tsx`:

```tsx
<div role="status" aria-busy="true" aria-label="Loading tasks" …>
  {skeletonCards.map((_, i) => (
    <div key={i} aria-hidden="true" …/>   {/* hides decorative shapes */}
  ))}
</div>
```

`role="status"` creates a live region — screen readers announce "Loading tasks" when it appears. `aria-hidden="true"` on the decorative placeholder shapes prevents them from being read out.

**`role="alert"`** vs **`role="status"`** in `components/ToastProvider.tsx`:

```tsx
role={t.variant === 'success' ? 'status' : 'alert'}
```

`role="alert"` is an assertive live region — it interrupts whatever the screen reader is currently announcing. Error messages deserve that interruption; success confirmations use `role="status"` which waits for a pause instead.

## Keyboard navigation and focus rings

Every interactive element must be reachable by Tab and operable by keyboard. Tailwind's `focus-visible:` variant applies styles only when focus arrived via keyboard (not click), avoiding the "ugly outline on click" problem.

A shared focus ring constant in `components/DeleteTaskButton.tsx`:

```tsx
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

// Applied with a colour per button role:
className={`text-red-600 ${focusRing} focus-visible:ring-red-500`}
```

`TaskCard` uses `focus-visible:outline-2 focus-visible:outline-blue-500` so the entire card link gets a clear blue outline when tabbed to.

## Key insight

Most accessibility wins are free if you use the right element and add a handful of attributes. The costly failures come from rebuilding native controls (`<div>` menus, `<span>` buttons) and then having to recreate keyboard and ARIA behaviour from scratch. Start with semantic HTML, then reach for ARIA only where HTML alone falls short.
