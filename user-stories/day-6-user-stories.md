# User Stories — Day 6 (Complete DB-Backed Backend)

**Project:** Task Management App backend
**Scope:** New endpoints and behaviors added in Day 6 (Prisma-backed `TasksService`, `User` model with one-to-many relation to tasks, pagination, and Prisma error mapping)

---

## A — Create a user (happy path)

**As** an API consumer,
**I want** to `POST /users` with a name and email,
**So that** I can register a user that tasks can later be assigned to.

**Given** no user exists with email `"ada@example.com"`
**When** I send `POST /users` with body `{ "name": "Ada Lovelace", "email": "ada@example.com" }`
**Then** the response status is `201 Created`
**And** the body is the user object with `id`, `name: "Ada Lovelace"`, `email: "ada@example.com"`, and `createdAt`

---

## B — Reject a duplicate email (409 path)

**As** an API consumer,
**I want** a clear conflict error when I create a user with an email that already exists,
**So that** I can distinguish a uniqueness violation from a generic server error.

**Given** a user already exists with email `"ada@example.com"`
**When** I send `POST /users` with body `{ "name": "Ada Byron", "email": "ada@example.com" }`
**Then** the response status is `409 Conflict`
**And** the body contains `{ "statusCode": 409, "message": "Email ada@example.com already in use", "error": "Conflict" }`
**And** no raw Prisma `P2002` error leaks through to the response

---

## C — Retrieve a user with their tasks (happy path)

**As** an API consumer,
**I want** to `GET /users/:id` and receive the user together with their tasks,
**So that** I can show a user and everything assigned to them in a single request.

**Given** a user exists with id `"user-1"` and has two tasks assigned via their `userId`
**When** I send `GET /users/user-1`
**Then** the response status is `200 OK`
**And** the body is the user object with `id`, `name`, `email`, `createdAt`
**And** the body includes a `tasks` array (via Prisma `include`) containing both assigned tasks

---

## D — Retrieve a non-existent user (404 path)

**As** an API consumer,
**I want** a clear error when I request a user that does not exist,
**So that** I can tell "not found" apart from a server error.

**Given** no user exists with id `"user-999"`
**When** I send `GET /users/user-999`
**Then** the response status is `404 Not Found`
**And** the body contains `{ "statusCode": 404, "message": "User #user-999 not found", "error": "Not Found" }`

---

## E — List tasks with pagination (first page)

**As** an API consumer,
**I want** to `GET /tasks?page=1&limit=10` and receive a paginated result envelope,
**So that** I can fetch tasks in manageable slices and know how many exist in total.

**Given** 12 tasks exist in the database
**When** I send `GET /tasks?page=1&limit=10`
**Then** the response status is `200 OK`
**And** the body is `{ "data": [...], "total": 12, "page": 1, "limit": 10 }`
**And** the `data` array contains the first 10 tasks (`skip = 0`, `take = 10`)

---

## F — List tasks with pagination (second page)

**As** an API consumer,
**I want** to request a later page via `GET /tasks?page=2&limit=10`,
**So that** I can navigate beyond the first slice of results.

**Given** 12 tasks exist in the database
**When** I send `GET /tasks?page=2&limit=10`
**Then** the response status is `200 OK`
**And** the body is `{ "data": [...], "total": 12, "page": 2, "limit": 10 }`
**And** the `data` array contains the remaining 2 tasks (`skip = 10`, `take = 10`)

---

## G — List tasks with default pagination

**As** an API consumer,
**I want** `GET /tasks` to apply sensible defaults when no query params are supplied,
**So that** I get a bounded, predictable result without having to specify pagination.

**Given** tasks exist in the database
**When** I send `GET /tasks` with no `page` or `limit` query params
**Then** the response status is `200 OK`
**And** the body is shaped `{ "data": [...], "total": <n>, "page": 1, "limit": 10 }` (defaults `page=1`, `limit=10`)

---

## H — Reject invalid pagination params (validation path)

**As** an API consumer,
**I want** the API to reject non-positive or non-integer pagination params with a 400,
**So that** malformed paging requests fail fast instead of returning a confusing slice.

**Given** the `PaginationDto` validates `page` and `limit` with `@IsInt` and `@Min(1)`
**When** I send `GET /tasks?page=0&limit=-5`
**Then** the response status is `400 Bad Request`
**And** the message indicates the `page`/`limit` fields failed validation

---

## I — Retrieve a non-existent task from the database (404 mapping)

**As** an API consumer,
**I want** a 404 when I `GET /tasks/:id` for an id that is not in the database,
**So that** I receive a consistent not-found response now that the store is Prisma-backed.

**Given** no task exists with id `"task-404"`
**When** I send `GET /tasks/task-404`
**Then** the response status is `404 Not Found`
**And** the body contains `{ "statusCode": 404, "message": "Task #task-404 not found", "error": "Not Found" }`

---

## J — Update or delete a missing task maps Prisma P2025 to 404

**As** an API consumer,
**I want** `PATCH`/`DELETE /tasks/:id` against a missing id to return a 404,
**So that** the underlying Prisma `P2025` (record not found) error is never exposed raw.

**Given** no task exists with id `"task-gone"`
**When** I send `DELETE /tasks/task-gone` (or `PATCH /tasks/task-gone` with a valid body)
**Then** the response status is `404 Not Found`
**And** no raw Prisma `P2025` error leaks through to the response
