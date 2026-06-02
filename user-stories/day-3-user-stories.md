# User Stories — Day 3 (First Tasks API + In-Memory Store + Validation)

**Project:** Task Management App backend
**Scope:** New endpoints and behaviors added in Day 3

---

## A — List all tasks on a fresh store (empty initial state)

**As** an API consumer,
**I want** to `GET /tasks` before any task has been created,
**So that** I get a predictable empty collection rather than an error or null.

**Given** the server has just started and no tasks have been created
**When** I send `GET /tasks`
**Then** the response status is `200 OK`
**And** the body is an empty array `[]`

---

## B — Create a task from a valid body (happy path)

**As** an API consumer,
**I want** to `POST /tasks` with a valid title and description,
**So that** a new task is created and returned with a generated id and default status.

**Given** the global `ValidationPipe` is enabled
**When** I send `POST /tasks` with body `{ "title": "Buy milk", "description": "Full fat" }`
**Then** the response status is `201 Created`
**And** the body is the created task with a generated `id`, `title: "Buy milk"`, `description: "Full fat"`, and `status: "OPEN"`

---

## C — Listed tasks reflect created tasks

**As** an API consumer,
**I want** `GET /tasks` to return every task I have created,
**So that** I can confirm the store persisted my task for the lifetime of the server.

**Given** a task was previously created via `POST /tasks`
**When** I send `GET /tasks`
**Then** the response status is `200 OK`
**And** the body is an array containing that task with its `id`, `title`, `description`, and `status`

---

## D — Reject a POST with a missing title (validation path)

**As** an API consumer,
**I want** the API to reject a body without a `title` with a `400`,
**So that** tasks can never be created without a meaningful title.

**Given** the global `ValidationPipe` and `CreateTaskDto` are in place
**When** I send `POST /tasks` with body `{ "description": "No title here" }`
**Then** the response status is `400 Bad Request`
**And** the message indicates the `title` field failed validation (`IsNotEmpty` / `IsString`)
**And** no task is added to the store

---

## E — Reject a POST with an empty title (validation path)

**As** an API consumer,
**I want** an empty-string `title` to be rejected with a `400`,
**So that** blank titles cannot slip through as valid tasks.

**Given** the global `ValidationPipe` and `CreateTaskDto` are in place
**When** I send `POST /tasks` with body `{ "title": "", "description": "ok" }`
**Then** the response status is `400 Bad Request`
**And** the message indicates the `title` field failed `IsNotEmpty` validation

---

## F — Reject a POST with a non-string title (type validation path)

**As** an API consumer,
**I want** a non-string `title` to be rejected with a `400`,
**So that** the stored task shape stays consistent and predictable.

**Given** the global `ValidationPipe` and `CreateTaskDto` are in place
**When** I send `POST /tasks` with body `{ "title": 123, "description": "ok" }`
**Then** the response status is `400 Bad Request`
**And** the message indicates the `title` field failed `IsString` validation
