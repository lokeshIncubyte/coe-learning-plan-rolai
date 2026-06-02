# Day 9 Checklist — Styling & User Experience

**Project:** Task Management App — polish the user interface
**Reference:** [`next.md`](../next.md), Tailwind CSS docs, Next.js + Tailwind guide, shadcn/ui (optional)
**Directory:** continues in `day-7/task-management-frontend/`

---

## 1. Learn — concepts before code
- [ ] Tailwind CSS with Next.js: setup, the utility-first model, `@theme`/config → [`notes/11-tailwind.md`]
- [ ] Utility-first workflow: spacing, flex/grid, typography, color scales → absorb into note 11
- [ ] Responsive design with Tailwind breakpoints (`sm` / `md` / `lg`) → [`notes/12-responsive.md`]
- [ ] Component libraries (shadcn/ui) — when to adopt vs hand-roll → [`notes/13-component-libraries.md`] (optional)
- [ ] Dark mode strategies (`class` strategy, theme toggle) → [`notes/14-dark-mode.md`]
- [ ] Accessibility basics: semantic HTML, keyboard navigation, ARIA, focus states → [`notes/15-accessibility.md`]

## 2. Setup — Tailwind
- [ ] Confirm Tailwind is installed/configured (or add it: `npm install -D tailwindcss postcss autoprefixer` + init)
- [ ] Tailwind directives in the global stylesheet; content paths cover `app/` and components
- [ ] Verify a utility class renders (sanity check)
- [ ] (Optional) Initialise shadcn/ui and add a couple of base components (Button, Card, Dialog)

## 3. Style — core pages
- [ ] Style the root layout: header/nav, container width, consistent spacing
- [ ] Style the task listing — cards or table rows, status badges (color per OPEN / IN_PROGRESS / DONE)
- [ ] Style the task detail page
- [ ] Style the create/edit forms — labels, inputs, buttons, error text
- [ ] Consistent design tokens (colors, spacing, radius) across pages

## 4. Responsive layout
- [ ] Listing adapts across mobile / tablet / desktop breakpoints
- [ ] Navigation usable on small screens (stack / menu)
- [ ] No horizontal overflow at 320px width
- [ ] Forms remain usable and readable on mobile

## 5. UX feedback
- [ ] Loading skeletons for the listing and detail (replace bare spinners where it improves perceived speed)
- [ ] Toast notifications for create / update / delete success and failure (library or small custom toaster)
- [ ] Empty states styled (no tasks yet → friendly prompt)
- [ ] Disabled/pending button states styled

## 6. Dark mode & accessibility
- [ ] Dark mode toggle implemented (class strategy), persists across reloads
- [ ] All pages legible in both light and dark
- [ ] Keyboard navigation: all interactive elements reachable + visible focus rings
- [ ] ARIA labels on icon-only buttons; form inputs associated with labels
- [ ] Color contrast meets a reasonable bar (status badges, text)

## 7. Verify — UX pass
- [ ] Walk through every page in light and dark mode
- [ ] Resize from mobile → desktop; layout holds at each breakpoint
- [ ] Trigger a toast for each CRUD action
- [ ] Navigate the whole app with keyboard only
- [ ] No console warnings / hydration errors

## 8. Ship
- [ ] `README.md` updated (styling stack, dark mode note)
- [ ] Commit and push

---

## Success Criteria (from next.md)
- [ ] Tailwind configured in the Task Management frontend
- [ ] Entire app styled with Tailwind
- [ ] Responsive design implemented
- [ ] Loading states (skeletons) implemented
- [ ] Toast notifications added for task actions
- [ ] Basic accessibility implemented (keyboard + ARIA)
- [ ] App looks professional with good UX throughout
