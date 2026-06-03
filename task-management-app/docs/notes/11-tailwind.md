# 11. Tailwind CSS 4 with Next.js

## What it is

Tailwind CSS is a **utility-first CSS framework**. Instead of writing named classes like `.card` or `.button` that bundle many styles together, you compose small, single-purpose classes directly in your markup: `rounded-lg`, `px-4`, `text-sm`, `hover:bg-blue-700`.

The result is that your stylesheet rarely grows — you keep reusing the same finite set of utilities, and the final CSS bundle only ships the classes you actually used.

Tailwind 4 is a major rewrite. The biggest change for day-to-day use is that **configuration moves into CSS** instead of a `tailwind.config.js` file, and you import the whole framework with a single `@import`.

## The utility-first mental model

Traditional CSS: write a class name → write styles in a separate file → worry about cascade and specificity.

Utility-first: the class *is* the style. `flex items-center gap-4` is a complete layout description that needs no external file to understand.

The tradeoff:
- HTML becomes more verbose
- You gain: no naming fatigue, no dead CSS, no specificity wars, styles and structure are co-located

## How it's used in this project

**Installation and import** — Tailwind 4 is loaded in one line at the top of `app/globals.css`:

```css
/* task-management-app/frontend/app/globals.css */
@import "tailwindcss";
```

That single import replaces the old `@tailwind base; @tailwind components; @tailwind utilities;` triple. Tailwind 4 auto-scans project files for used classes; no `content` array is needed in a config file.

**Design tokens via `@theme`** — custom CSS variables are mapped into Tailwind's token system directly in the same file:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Anything declared inside `@theme` becomes available as a Tailwind utility. `--color-background` means you can write `bg-background` in markup.

**Utility classes in practice** — a representative example from `components/TaskCard.tsx`:

```tsx
<Link
  href={`/tasks/${task.id}`}
  className="block w-full rounded-lg border border-gray-200 p-4
             hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
>
```

Each segment is one style decision: `rounded-lg` sets `border-radius`, `p-4` sets uniform padding, `hover:bg-gray-50` applies a background only on pointer hover. No stylesheet needed.

## Key insight

Tailwind 4 leans further into CSS-native primitives. `@theme`, `@custom-variant`, and cascade layers replace the JavaScript config. This means less tooling indirection — the CSS file *is* the configuration.
