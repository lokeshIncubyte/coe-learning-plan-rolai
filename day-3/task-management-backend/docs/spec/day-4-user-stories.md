# User Stories — Day 4 (Full CRUD + Exceptions + DI)

**Project:** Task Management App backend
**Scope:** New endpoints and behaviors added in Day 4

---

## A — Retrieve a specific task by ID (happy path)

**As** an API consumer,
**I want** to `GET /tasks/:id` with a valid task ID,
**So that** I receive the full task object for that ID.

**Given** a task was previously created via `POST /tasks`
**When** I send `GET /tasks/<that-id>`
**Then** the response status is `200 OK`
**And** the body is the task object with `id`, `title`, `description`, and `status`

---

## B — Retrieve a non-existent task (404 path)

**As** an API consumer,
**I want** a clear error when I request a task that does not exist,
**So that** I can distinguish "not found" from a server error.

**Given** no task exists with id `"abc-999"`
**When** I send `GET /tasks/abc-999`
**Then** the response status is `404 Not Found`
**And** the body contains `{ "statusCode": 404, "message": "Task #abc-999 not found", "error": "Not Found" }`

---

## C — Partially update a task's fields (happy path)

**As** an API consumer,
**I want** to `PATCH /tasks/:id` with a subset of task fields,
**So that** only the supplied fields are updated and the rest are unchanged.

**Given** a task exists with `{ title: "Buy milk", description: "Full fat", status: "OPEN" }`
**When** I send `PATCH /tasks/<id>` with body `{ "title": "Buy oat milk" }`
**Then** the response status is `200 OK`
**And** the returned task has `title: "Buy oat milk"`, `description: "Full fat"`, `status: "OPEN"` (unchanged)

---

## D — Update a task's status

**As** an API consumer,
**I want** to change a task's `status` via `PATCH /tasks/:id`,
**So that** I can move tasks through the `OPEN → IN_PROGRESS → DONE` lifecycle.

**Given** a task exists with `status: "OPEN"`
**When** I send `PATCH /tasks/<id>` with body `{ "status": "IN_PROGRESS" }`
**Then** the response status is `200 OK`
**And** the returned task has `status: "IN_PROGRESS"`

---

## E — Update a non-existent task (404 path)

**As** an API consumer,
**I want** a clear 404 when I PATCH a task that doesn't exist,
**So that** I know the update was not applied rather than silently failing.

**Given** no task exists with id `"xyz-000"`
**When** I send `PATCH /tasks/xyz-000` with a valid body
**Then** the response status is `404 Not Found`

---

## F — Delete a task (happy path)

**As** an API consumer,
**I want** to `DELETE /tasks/:id` to remove a task,
**So that** it no longer appears in subsequent `GET /tasks` responses.

**Given** a task exists with a known id
**When** I send `DELETE /tasks/<id>`
**Then** the response status is `204 No Content` with an empty body
**And** a subsequent `GET /tasks` does not include that task

---

## G — Delete a non-existent task (404 path)

**As** an API consumer,
**I want** a 404 when I attempt to delete a task that doesn't exist,
**So that** I can tell whether the delete succeeded or the id was invalid.

**Given** no task exists with id `"gone-123"`
**When** I send `DELETE /tasks/gone-123`
**Then** the response status is `404 Not Found`

---

## H — Unknown fields are stripped from POST body (whitelist)

**As** an API consumer (or security reviewer),
**I want** extra fields in the POST body to be silently dropped,
**So that** callers cannot inject unexpected properties into the created task.

**Given** the global `ValidationPipe` is configured with `whitelist: true`
**When** I send `POST /tasks` with body `{ "title": "Test", "description": "ok", "isAdmin": true }`
**Then** the response status is `201 Created`
**And** the returned task has no `isAdmin` field

---

## I — Retrieve aggregate stats for all tasks

**As** an API consumer,
**I want** to `GET /tasks/stats` to see a count of total and open tasks,
**So that** I can display a summary without fetching the full task list.

**Given** three tasks exist, two with `status: "OPEN"` and one with `status: "DONE"`
**When** I send `GET /tasks/stats`
**Then** the response status is `200 OK`
**And** the body is `{ "total": 3, "open": 2 }`

---

## J — PATCH with an invalid status value (validation path)

**As** an API consumer,
**I want** the API to reject an invalid `status` value with a 400,
**So that** tasks can never be put into an unknown state.

**Given** a task exists with a known id
**When** I send `PATCH /tasks/<id>` with body `{ "status": "FLYING" }`
**Then** the response status is `400 Bad Request`
**And** the message indicates the status field failed `IsEnum` validation
