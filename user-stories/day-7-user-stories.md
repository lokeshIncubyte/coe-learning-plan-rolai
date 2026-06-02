# User Stories — Day 7 (Next.js Frontend — First Pages)

**Project:** Task Management App frontend
**Scope:** Task listing page, task detail page, shared layouts, and loading/error states added in Day 7 (web UI, viewed in a browser)

---

## A — View the list of tasks

**As** a user of the Task Management app,
**I want** to open the tasks page and see all my tasks,
**So that** I can get an overview of everything I have to do.

**Given** the backend has several tasks and I am on the home page
**When** I navigate to `/tasks`
**Then** I see a page titled "Tasks" with one row per task
**And** each row shows the task's title and status
**And** the list reflects the tasks returned by the backend

---

## B — See an empty state when there are no tasks

**As** a user with a clean account,
**I want** a friendly message when I have no tasks,
**So that** I understand the list is empty rather than thinking the page is broken.

**Given** the backend returns zero tasks
**When** I open `/tasks`
**Then** I do not see any task rows
**And** I see an empty-state message such as "No tasks yet"

---

## C — Open a task's detail page

**As** a user browsing the task list,
**I want** to click a task and see its full details,
**So that** I can read everything about that one task.

**Given** I am viewing the list at `/tasks`
**When** I click a task in the list
**Then** the browser navigates to `/tasks/<that-id>`
**And** I see the task's title, full description, status, and timestamps on the page

---

## D — See a not-found state for an unknown task

**As** a user who follows a stale or mistyped link,
**I want** a clear "task not found" page,
**So that** I know the task does not exist instead of seeing a blank or broken screen.

**Given** no task exists with the id in the URL
**When** I visit `/tasks/does-not-exist`
**Then** I see a not-found page (e.g. "Task not found")
**And** I am offered a way back to the task list

---

## E — See a loading state while the list fetches

**As** a user on a slow connection,
**I want** visible feedback while the task list loads,
**So that** I know the app is working and not frozen.

**Given** the backend has not yet responded with the task list
**When** I navigate to `/tasks`
**Then** I briefly see a loading indicator (skeleton or spinner)
**And** the indicator is replaced by the task list once the data arrives

---

## F — See a loading state while a task detail fetches

**As** a user opening a task,
**I want** loading feedback on the detail page,
**So that** the page does not appear empty while the single task is fetched.

**Given** the backend has not yet responded with the requested task
**When** I navigate to `/tasks/<id>`
**Then** I briefly see a loading indicator on the detail page
**And** it is replaced by the task's details once the data arrives

---

## G — See an error state when the backend is down

**As** a user when the server is unreachable,
**I want** a graceful error message,
**So that** the app does not crash and I understand something went wrong.

**Given** the backend on `http://localhost:3001` is not responding
**When** I open `/tasks`
**Then** I see an error message instead of a crash or blank page (e.g. "Something went wrong")
**And** I am offered a way to retry loading the page

---

## H — Navigate the app via the shared layout

**As** a user moving between pages,
**I want** a consistent header and navigation present on every page,
**So that** I can always find my way to the tasks list and back home.

**Given** I am on any page of the app
**When** the page renders
**Then** I see the shared header/navigation from the root layout
**And** I can use it to navigate to the home page and to `/tasks` from anywhere
