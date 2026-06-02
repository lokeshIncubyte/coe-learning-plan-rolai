# User Stories — Day 8 (Next.js Forms & Client Components — Interactive CRUD)

**Project:** Task Management App frontend
**Scope:** Interactive create / edit / delete flows added in Day 8, from the perspective of a person using the Task Management UI in a browser

---

## A — Add a new task via a form (happy path)

**As** a person using the Task Management app,
**I want** to fill in a form and submit a new task,
**So that** my task is saved and shows up in my task list right away.

**Given** I am on the task list page and I click "New Task"
**When** I type "Buy milk" into the Title field, "Full fat" into Description, leave Status as "OPEN", and click "Create"
**Then** I am returned to the task list (or the new task's detail view)
**And** a task titled "Buy milk" now appears in the list
**And** the task is still there after I refresh the page

---

## B — Client-side validation blocks an empty title

**As** a person using the app,
**I want** the form to stop me before I submit a task with no title,
**So that** I get instant feedback instead of waiting for a server error.

**Given** I am on the "New Task" form with the Title field left empty (or only spaces)
**When** I click "Create"
**Then** the form is not submitted and no network request is sent
**And** an inline message such as "Title is required" appears next to the Title field
**And** the Create button stays available so I can fix the title and try again

---

## C — Edit an existing task

**As** a person using the app,
**I want** to open a task in an edit form pre-filled with its current values,
**So that** I can change just the fields I want and save the update.

**Given** a task "Buy milk" exists and I open its "Edit" form
**When** the form loads pre-filled with title "Buy milk", description "Full fat", and status "OPEN"
**And** I change the Title to "Buy oat milk" and click "Save"
**Then** I am returned to the task's detail view
**And** the task now shows title "Buy oat milk" with description "Full fat" and status "OPEN" unchanged
**And** the change persists after I refresh the page

---

## D — Delete a task with a confirmation step

**As** a person using the app,
**I want** to be asked to confirm before a task is deleted,
**So that** I don't lose a task by clicking "Delete" accidentally.

**Given** a task exists and I click its "Delete" button
**When** a confirmation dialog appears asking "Delete this task?"
**And** I click "Cancel"
**Then** nothing is deleted and the task remains in the list
**When** I click "Delete" again and this time click "Confirm"
**Then** the task is removed from the list
**And** it is gone after I refresh the page

---

## E — Optimistic delete with rollback on failure

**As** a person using the app,
**I want** a deleted task to disappear from the list immediately,
**So that** the UI feels fast — but I want it to come back if the delete actually failed.

**Given** the task list is showing "Buy milk" and the backend is unreachable
**When** I confirm deletion of "Buy milk"
**Then** the row disappears from the list immediately, before the server responds
**And** when the request fails, the "Buy milk" row reappears in its original place
**And** an error message such as "Couldn't delete the task. Please try again." is shown

---

## F — Graceful error message when a submit fails

**As** a person using the app,
**I want** to see a clear message when saving a task fails,
**So that** I know my change wasn't saved instead of being left guessing.

**Given** I am on the "New Task" form and the backend rejects or cannot accept my submission
**When** I click "Create" and the request returns an error (e.g. a 400 validation error or the server is down)
**Then** the form stays open with my typed values still in place
**And** a visible error message is shown (backend validation messages surfaced inline where applicable)
**And** the error is never silently swallowed — I always get feedback

---

## G — Submit button shows a pending state

**As** a person using the app,
**I want** the submit button to show that it's working and prevent double-clicks,
**So that** I don't accidentally create or update the same task twice.

**Given** I am on the "New Task" or "Edit" form with valid values entered
**When** I click the submit button and the request is in flight
**Then** the button shows a pending state (e.g. disabled and labelled "Saving…")
**And** I cannot submit the form again until the request completes
**And** the button returns to normal once the request succeeds or fails

---

## H — Editing a task that no longer exists (404 path)

**As** a person using the app,
**I want** a clear message when I try to edit a task that has been deleted,
**So that** I understand why my change can't be saved instead of seeing a broken page.

**Given** I have the "Edit" form open for a task that another action has since deleted
**When** I change a field and click "Save" and the backend responds that the task is not found
**Then** I see a friendly message such as "This task no longer exists."
**And** I am offered a way back to the task list rather than being left on a dead form
