# User Stories — Day 9 (Styling & UX with Tailwind)

**Project:** Task Management App frontend
**Scope:** Styling, responsive layout, status badges, loading skeletons, toast notifications, dark mode, and accessibility added in Day 9

---

## A — Responsive task listing on mobile (320px, no overflow)

**As** a person using the app on my phone,
**I want** the task listing to fit my screen without sideways scrolling,
**So that** I can read and tap tasks comfortably with one hand.

**Given** I open the task listing in a browser viewport 320px wide
**When** the page renders
**Then** task cards stack in a single column and fill the available width
**And** the page does not scroll horizontally (no content is clipped off-screen)
**And** all text wraps within the card rather than overflowing

---

## B — Responsive task listing on desktop

**As** a person using the app on a laptop,
**I want** the listing to use the extra width,
**So that** I can scan more tasks at once without excessive whitespace.

**Given** I open the task listing in a viewport at least 1024px wide (`lg`)
**When** the page renders
**Then** task cards lay out in a multi-column grid within a centered, max-width container
**And** consistent spacing separates the cards
**And** the same content shown on mobile remains present, just re-flowed

---

## C — Navigation is usable on small screens

**As** a person on a narrow screen,
**I want** the header navigation to remain reachable,
**So that** I can move between pages without the nav breaking the layout.

**Given** I am on any page at a mobile width
**When** I view the header
**Then** the navigation stacks or collapses into a compact/menu form that fits the width
**And** every nav destination is still reachable by tapping
**And** the header does not push content off-screen or overlap the page title

---

## D — Color-coded status badges

**As** a person scanning my task list,
**I want** each task's status shown as a color-coded badge,
**So that** I can tell OPEN, IN_PROGRESS, and DONE tasks apart at a glance.

**Given** the listing shows tasks with statuses `OPEN`, `IN_PROGRESS`, and `DONE`
**When** I look at each task card
**Then** each status renders as a labeled badge with a distinct color (e.g. gray/neutral for OPEN, blue/amber for IN_PROGRESS, green for DONE)
**And** the badge text matches the task's actual status
**And** the badge color and text meet a readable contrast bar in both light and dark mode

---

## E — Loading skeletons while data loads

**As** a person opening the app on a slow connection,
**I want** to see placeholder content while tasks load,
**So that** the app feels responsive instead of showing a blank or frozen screen.

**Given** the task listing is fetching data and no tasks have arrived yet
**When** I view the page during the load
**Then** skeleton placeholders shaped like task cards are displayed
**And** when the data arrives the skeletons are replaced by the real task cards
**And** the layout does not jump noticeably as skeletons swap to content

---

## F — Friendly empty state when there are no tasks

**As** a brand-new user with no tasks,
**I want** a clear, styled message instead of a blank list,
**So that** I understand the app is working and know what to do next.

**Given** my account has zero tasks
**When** the listing finishes loading
**Then** an empty-state message is shown (e.g. "No tasks yet")
**And** a prompt or call-to-action invites me to create my first task
**And** no skeletons or error text remain visible

---

## G — Toast on successful task create

**As** a person creating a task,
**I want** a confirmation toast when it saves,
**So that** I know the action succeeded without re-reading the whole list.

**Given** I have filled in the create-task form with a valid title
**When** I submit and the save succeeds
**Then** a success toast appears (e.g. "Task created")
**And** the new task appears in the listing
**And** the toast dismisses itself after a few seconds (or when I close it)

---

## H — Toast on successful task update

**As** a person editing a task,
**I want** a confirmation toast when my changes save,
**So that** I trust the edit was persisted.

**Given** I have changed a field (such as the title or status) on the edit form
**When** I submit and the update succeeds
**Then** a success toast appears (e.g. "Task updated")
**And** the updated values are reflected in the task detail/listing

---

## I — Toast on successful task delete

**As** a person deleting a task,
**I want** a confirmation toast when it is removed,
**So that** I get clear feedback for a destructive action.

**Given** I trigger delete on an existing task
**When** the delete succeeds
**Then** a success toast appears (e.g. "Task deleted")
**And** the task is removed from the listing

---

## J — Toast on a failed task action

**As** a person whose action fails (e.g. the server is unreachable),
**I want** an error toast,
**So that** I know it did not work and can retry instead of assuming success.

**Given** I submit a create, update, or delete action
**When** the request fails (network error or server error response)
**Then** an error-styled toast appears explaining the action failed (e.g. "Couldn't save task")
**And** the listing is not changed to falsely show the action as applied
**And** the relevant button returns to its normal (non-pending) state so I can retry

---

## K — Disabled / pending button state during submit

**As** a person submitting a form,
**I want** the submit button to show it is working,
**So that** I don't double-submit or wonder whether my click registered.

**Given** I am on the create or edit form
**When** I click submit and the request is in flight
**Then** the submit button shows a pending/disabled state (e.g. spinner or "Saving…")
**And** the button cannot be clicked again while the request is pending
**And** it returns to its normal label once the request completes (success or failure)

---

## L — Dark mode toggle that persists across reloads

**As** a person who prefers a dark interface,
**I want** to toggle dark mode and have it stick,
**So that** the app stays in my chosen theme every time I return.

**Given** I am viewing the app in light mode
**When** I click the dark-mode toggle
**Then** the whole app switches to dark styling (backgrounds, text, badges all legible)
**And** when I reload the page the app is still in dark mode
**And** toggling back to light mode persists the same way on reload

---

## M — Legibility in both light and dark mode

**As** a person using either theme,
**I want** every page to stay readable,
**So that** switching themes never leaves text or badges hard to see.

**Given** I have set the app to either light or dark mode
**When** I walk through the listing, detail page, and create/edit forms
**Then** text, labels, inputs, and status badges remain readable with adequate contrast
**And** no element appears as dark-on-dark or light-on-light
**And** focus rings and borders remain visible in the active theme

---

## N — Keyboard-only navigation with visible focus

**As** a person who navigates with the keyboard,
**I want** to reach and operate every control using Tab/Enter,
**So that** I can use the whole app without a mouse.

**Given** I load any page and use only the keyboard
**When** I press `Tab` repeatedly
**Then** focus moves through every interactive element (links, buttons, inputs, the theme toggle) in a sensible order
**And** the currently focused element shows a clearly visible focus ring
**And** pressing `Enter`/`Space` activates the focused control (submit, navigate, toggle, delete)

---

## O — ARIA labels and associated form labels

**As** a person using a screen reader,
**I want** controls to announce what they do,
**So that** icon-only buttons and form fields are understandable without sight.

**Given** the UI includes icon-only buttons (e.g. delete, theme toggle) and form inputs
**When** my screen reader focuses each control
**Then** each icon-only button announces a meaningful label via `aria-label`
**And** every form input is programmatically associated with its visible label
**And** status badges expose their status as readable text, not color alone

---
