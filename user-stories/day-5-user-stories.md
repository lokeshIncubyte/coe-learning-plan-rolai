# User Stories — Day 5 (PostgreSQL & Prisma Setup)

**Project:** Task Management App backend
**Scope:** Persistence layer added in Day 5 — Task data backed by Neon PostgreSQL via Prisma

---

## A — Created tasks survive a server restart

**As** an API consumer,
**I want** tasks I create to persist across server restarts,
**So that** my data is durable and not lost when the process stops.

**Given** I created a task via `POST /tasks` and received its `id`
**When** the NestJS server is stopped and started again
**And** I send `GET /tasks/<that-id>`
**Then** the response status is `200 OK`
**And** the body is the same task object with its original `id`, `title`, `description`, and `status`

---

## B — Task data is stored in PostgreSQL, not in memory

**As** an API consumer,
**I want** tasks to be written to a real PostgreSQL database via Prisma,
**So that** the data lives in durable storage rather than an in-memory array.

**Given** the `PrismaService` is wired into the NestJS DI container via a global `PrismaModule`
**When** I create a task via `POST /tasks`
**Then** a corresponding row exists in the `Task` table in the Neon Postgres database
**And** the same row is visible via Prisma Studio or `psql` independently of the running process

---

## C — New tasks receive a server-generated UUID and timestamps

**As** an API consumer,
**I want** the database to assign each task a unique `id` and creation timestamp,
**So that** I can reference tasks reliably without supplying my own identifiers.

**Given** the `Task` model defines `id String @id @default(uuid())`, `createdAt DateTime @default(now())`, and `updatedAt DateTime @updatedAt`
**When** I send `POST /tasks` with body `{ "title": "Buy milk", "description": "Full fat" }`
**Then** the response status is `201 Created`
**And** the returned task has a server-generated UUID `id`
**And** the task has populated `createdAt` and `updatedAt` timestamps

---

## D — `updatedAt` advances when a task is modified

**As** an API consumer,
**I want** the `updatedAt` timestamp to change whenever a task is updated,
**So that** I can tell when a task was last modified.

**Given** a task exists with a known `id` and an initial `updatedAt` value
**When** I send `PATCH /tasks/<id>` with body `{ "title": "Buy oat milk" }`
**Then** the response status is `200 OK`
**And** the returned task has a `updatedAt` timestamp later than the original
**And** the `createdAt` timestamp is unchanged

---

## E — Status column is constrained to the `TaskStatus` enum

**As** an API consumer,
**I want** the database schema to only allow valid status values,
**So that** a task can never be persisted in an unknown state.

**Given** the schema defines a `TaskStatus` enum with values `OPEN`, `IN_PROGRESS`, `DONE`
**And** the `status` field defaults to `OPEN`
**When** I create a task via `POST /tasks` without supplying a `status`
**Then** the persisted task has `status: "OPEN"`
**And** the `Task` table column rejects any value outside the `TaskStatus` enum at the database level

---

## F — Deleted tasks are permanently removed from the database

**As** an API consumer,
**I want** a deleted task to be removed from PostgreSQL durably,
**So that** it does not reappear after a server restart or in later queries.

**Given** a task exists with a known `id`
**When** I send `DELETE /tasks/<id>`
**Then** the response status is `204 No Content`
**And** no row with that `id` remains in the `Task` table
**And** the task is still absent from `GET /tasks` after the server is restarted
