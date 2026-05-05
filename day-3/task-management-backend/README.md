# Task Management Backend

NestJS REST API — Days 3 & 4 of the CoE learning plan. In-memory task store with full CRUD, request validation, and service-to-service dependency injection.

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

## Setup

```bash
npm install
```

## Run

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

Server starts on **port 3001** (port 3000 is reserved on this machine).

## API

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/tasks` | — | `Task[]` — 200 |
| POST | `/tasks` | `CreateTaskDto` | `Task` — 201 |
| GET | `/tasks/stats` | — | `{ total, open }` — 200 |
| GET | `/tasks/:id` | — | `Task` — 200 or 404 |
| PATCH | `/tasks/:id` | `UpdateTaskDto` | `Task` — 200 or 404 |
| DELETE | `/tasks/:id` | — | empty — 204 or 404 |

### Task shape

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "OPEN"
}
```

### TaskStatus values

| Value | Meaning |
|-------|---------|
| `OPEN` | Default — task not started |
| `IN_PROGRESS` | Task is being worked on |
| `DONE` | Task completed |

### CreateTaskDto

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | non-empty |
| `description` | string | no | defaults to `""` if omitted |
| `status` | `TaskStatus` | no | defaults to `OPEN` |

### UpdateTaskDto

All fields from `CreateTaskDto` are optional (uses `PartialType`). Omitted fields are left unchanged.

### Validation

`ValidationPipe` is configured globally with `whitelist: true` and `transform: true`:

- Unknown fields are silently stripped from the request body
- Path/query params are auto-coerced to declared types
- Invalid bodies return HTTP 400:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["title should not be empty"]
}
```

### Stats endpoint

`GET /tasks/stats` returns aggregate counts:

```json
{ "total": 5, "open": 3 }
```

## Test

```bash
# unit + e2e tests
npm test

# watch mode
npm run test:watch

# coverage
npm run test:cov
```

30 tests total: 21 unit, 9 e2e.

## Project structure

```
src/
├── app.module.ts
├── main.ts
└── tasks/
    ├── dto/
    │   ├── create-task.dto.ts
    │   └── update-task.dto.ts
    ├── task.interface.ts
    ├── tasks.controller.ts
    ├── tasks.module.ts
    ├── tasks.service.ts
    └── tasks.stats.service.ts
test/
└── tasks.e2e-spec.ts
```

## Docs

- [`docs/spec/day-4-requirements.md`](docs/spec/day-4-requirements.md) — Day 4 requirements
- [`docs/spec/day-4-checklist.md`](docs/spec/day-4-checklist.md) — Day 4 checklist
- [`docs/notes/`](docs/notes/) — NestJS concept notes
