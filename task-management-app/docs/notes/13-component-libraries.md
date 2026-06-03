# 13. Component Libraries — When to Adopt vs Hand-Roll

## What they are

A component library gives you pre-built, pre-styled UI primitives — buttons, dialogs, dropdowns, date pickers — so you don't have to build and test them from scratch. Two common choices in the Next.js ecosystem:

- **Headless libraries** (Radix UI, Headless UI) — handle behaviour and accessibility with zero default styles. You supply all visual styling.
- **Full-stack libraries** (shadcn/ui, Chakra UI, MUI) — combine accessible primitives with opinionated styles. shadcn/ui is unusual: it copies component source code directly into your repo rather than installing a black-box package.

## shadcn/ui — what makes it different

Most libraries are npm packages. `shadcn/ui` is a CLI tool that copies the component source into `components/ui/`. You own the code, can read it, and can edit it without forking a package. This makes it popular for teams that want a head-start without giving up control.

```bash
npx shadcn@latest init        # sets up the base
npx shadcn@latest add button  # copies Button source into your project
```

## When to adopt a library

Reach for one when:
- You need complex, accessibility-sensitive widgets (date pickers, comboboxes, modals with focus traps) — these are genuinely hard to get right
- You want a consistent design system baseline without designing tokens from scratch
- The project is growing past a handful of components and you want convention to take over

## When to hand-roll

Stay without a library when:
- The UI is genuinely simple and the components you need are lightweight
- You want to keep the dependency count low and understand every byte you ship
- The library's style opinions would require fighting overrides

## How this project decided

This project **hand-rolled all components** with plain Tailwind. The UI it needs — cards, badges, a form, a toast — is simple enough that a component library would add overhead without much benefit.

The result: `StatusBadge`, `TaskCard`, `TaskListSkeleton`, and `ToastProvider` are all short, self-contained files in `components/`. Each is easy to read, test, and modify because there is no library abstraction underneath.

```tsx
// components/StatusBadge.tsx — 25 lines, no external dependency
const BASE = 'inline-block rounded-full px-2 py-0.5 text-xs font-medium'

const CLASSES: Record<TaskStatus, string> = {
  OPEN:        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  DONE:        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
}
```

## Key insight

The choice is not "library = good, hand-rolled = bad" or vice versa. It is a **scope question**: libraries accelerate complex, repeated primitives; hand-rolling wins when the problem is small and well-defined. Know what your project actually needs before reaching for either.
