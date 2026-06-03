# Day 9 Checklist — Styling & User Experience

**Project:** Task Management App — polish the user interface
**Reference:** [`next.md`](../next.md), Tailwind CSS docs, Next.js + Tailwind guide, shadcn/ui (optional)
**Directory:** continues in `day-7/task-management-frontend/`

---

## 1. Learn — concepts before code
- [x] Tailwind CSS with Next.js: setup, the utility-first model, `@theme`/config → [`notes/11-tailwind.md`]
- [x] Utility-first workflow: spacing, flex/grid, typography, color scales → absorb into note 11
- [x] Responsive design with Tailwind breakpoints (`sm` / `md` / `lg`) → [`notes/12-responsive.md`]
- [x] Component libraries (shadcn/ui) — when to adopt vs hand-roll → [`notes/13-component-libraries.md`] (optional)
- [x] Dark mode strategies (`class` strategy, theme toggle) → [`notes/14-dark-mode.md`]
- [x] Accessibility basics: semantic HTML, keyboard navigation, ARIA, focus states → [`notes/15-accessibility.md`]

## 2. Setup — Tailwind
- [x] Confirm Tailwind is installed/configured (or add it: `npm install -D tailwindcss postcss autoprefixer` + init)
- [x] Tailwind directives in the global stylesheet; content paths cover `app/` and components
- [x] Verify a utility class renders (sanity check)
- [ ] (Optional) Initialise shadcn/ui and add a couple of base components (Button, Card, Dialog)

## 3. Style — core pages
- [x] Style the root layout: header/nav, container width, consistent spacing
- [x] Style the task listing — cards or table rows, status badges (color per OPEN / IN_PROGRESS / DONE)
- [x] Style the task detail page
- [x] Style the create/edit forms — labels, inputs, buttons, error text
- [x] Consistent design tokens (colors, spacing, radius) across pages

## 4. Responsive layout
- [x] Listing adapts across mobile / tablet / desktop breakpoints
- [x] Navigation usable on small screens (stack / menu)
- [x] No horizontal overflow at 320px width
- [x] Forms remain usable and readable on mobile

## 5. UX feedback
- [x] Loading skeletons for the listing and detail (replace bare spinners where it improves perceived speed)
- [x] Toast notifications for create / update / delete success and failure (library or small custom toaster)
- [x] Empty states styled (no tasks yet → friendly prompt)
- [x] Disabled/pending button states styled

## 6. Dark mode & accessibility
- [x] Dark mode toggle implemented (class strategy), persists across reloads
- [x] All pages legible in both light and dark
- [x] Keyboard navigation: all interactive elements reachable + visible focus rings
- [x] ARIA labels on icon-only buttons; form inputs associated with labels
- [x] Color contrast meets a reasonable bar (status badges, text)

## 7. Verify — UX pass
- [x] Walk through every page in light and dark mode
- [x] Resize from mobile → desktop; layout holds at each breakpoint
- [x] Trigger a toast for each CRUD action
- [x] Navigate the whole app with keyboard only
- [x] No console warnings / hydration errors

## 8. Ship
- [x] `README.md` updated (styling stack, dark mode note)
- [x] Commit and push

---

## Success Criteria (from next.md)
- [x] Tailwind configured in the Task Management frontend
- [x] Entire app styled with Tailwind
- [x] Responsive design implemented
- [x] Loading states (skeletons) implemented
- [x] Toast notifications added for task actions
- [x] Basic accessibility implemented (keyboard + ARIA)
- [x] App looks professional with good UX throughout
