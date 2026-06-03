# 14. Dark Mode — The Class Strategy

## What it is

Tailwind supports two dark mode strategies:

- **`media`** — responds to the OS-level `prefers-color-scheme` media query automatically. No JavaScript required, but the user can't override it from within the app.
- **`class`** — activates dark styles when a `dark` class is present on a parent element (usually `<html>`). You control when and how it is applied. Users can toggle it independently of their OS setting.

This project uses the `class` strategy.

## How the class strategy works in Tailwind 4

In Tailwind 4 there is no `darkMode` key in a config file. You declare a custom variant in your CSS instead:

```css
/* app/globals.css */
@custom-variant dark (&:where(.dark, .dark *));
```

This tells Tailwind: generate `dark:` prefixed utilities that activate whenever the element (or any ancestor) has the class `dark`. From that point, writing `dark:bg-gray-800` in JSX just works.

CSS custom properties also respond to the class:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

Every component that reads `bg-background` or `text-foreground` automatically repaints when `.dark` is toggled.

## Persistence without flicker — the inline script trick

The tricky part of class-based dark mode in a server-rendered app is **flash of wrong theme**: the server renders light-mode HTML, the JS bundle loads, reads `localStorage`, and toggles dark. The user sees a white flash.

The fix is a tiny inline `<script>` that runs before the browser paints anything. In `app/layout.tsx`:

```tsx
const themeInitScript = `
try {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

// Inside RootLayout:
<html suppressHydrationWarning …>
  <head>
    <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
  </head>
```

`suppressHydrationWarning` on `<html>` tells React to ignore the mismatch between the server-rendered class list and whatever the inline script may have added — this is an intentional, safe use of that prop.

## The ThemeToggle component

`components/ThemeToggle.tsx` handles the runtime toggle:

```tsx
function toggle() {
  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  setTheme(next)
  document.documentElement.classList.toggle('dark', next === 'dark')
  localStorage.setItem('theme', next)
}
```

Three things happen atomically: React state updates (re-renders the button icon), the `dark` class flips on `<html>` (every `dark:` utility repaints), and `localStorage` records the preference for the next page load.

## Key insight

The class strategy puts theme control in your hands. The inline script is the essential companion — without it you trade a persistent preference for a visible flash on every page load.
