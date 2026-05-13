# Task Management Backend

NestJS REST API — Days 3–6 of the CoE learning plan. Full CRUD for tasks and users backed by a Neon (PostgreSQL) database via Prisma, with request validation, pagination, and error mapping.

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A [Neon](https://neon.tech) PostgreSQL database (free tier is fine)

## Setup

```bash
npm install
```

Copy the example env file and fill in your Neon connection string:

```bash
cp .env.example .env
# edit .env and set DATABASE_URL to your Neon connection string
# format: postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

Run migrations to create the `Task` and `User` tables:

```bash
npx prisma migrate deploy
```

Seed the database with sample users and tasks:

```bash
npx prisma db seed
```

This creates 2 users (Alice, Bob) and 5 tasks with mixed statuses, some assigned to users.

### WSL2 note

Neon endpoints publish both A and AAAA DNS records. WSL2 has no outbound IPv6 route, so Node connections to Neon time out when IPv6 is tried first. `npm run start:dev` and `npm run crud:test` both set `NODE_OPTIONS=--require ./scripts/wsl2-ipv4.cjs` to patch `dns.lookup` to IPv4-only. This shim is not applied in production (`start:prod`).

## Run

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

Server starts on **port 3001** (port 3000 is reserved on this machine).

## API

### Tasks

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/tasks` | — | paginated — 200 |
| POST | `/tasks` | `CreateTaskDto` | `Task` — 201 |
| GET | `/tasks/stats` | — | `{ total, open }` — 200 |
| GET | `/tasks/:id` | — | `Task` — 200 or 404 |
| PATCH | `/tasks/:id` | `UpdateTaskDto` | `Task` — 200 or 404 |
| DELETE | `/tasks/:id` | — | empty — 204 or 404 |

### Users

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/users` | `CreateUserDto` | `User` — 201 or 409 |
| GET | `/users/:id` | — | `User` with tasks — 200 or 404 |

## Pagination

`GET /tasks` supports optional query params:

```
GET /tasks?page=2&limit=5
```

| Param | Type | Default | Constraints |
|-------|------|---------|-------------|
| `page` | integer | 1 | ≥ 1 |
| `limit` | integer | 10 | ≥ 1, ≤ 100 |

Response shape:

```json
{
  "data": [...],
  "total": 42,
  "page": 2,
  "limit": 5
}
```

## Shapes

### Task

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "status": "OPEN",
  "userId": "uuid | null",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### User (with tasks)

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "createdAt": "ISO 8601",
  "tasks": [...]
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
| `description` | string | no | optional |
| `status` | `TaskStatus` | no | defaults to `OPEN` |

### UpdateTaskDto

All fields from `CreateTaskDto` are optional (uses `PartialType`). Omitted fields are left unchanged.

### CreateUserDto

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | non-empty |
| `email` | string | yes | valid email, unique |

## Error responses

| Scenario | Status | Body |
|----------|--------|------|
| Validation failure | 400 | `{ statusCode, message[], error }` |
| Record not found | 404 | `{ statusCode, message }` |
| Duplicate email | 409 | `{ statusCode, message: "Email already in use" }` |

### Validation

`ValidationPipe` is configured globally with `whitelist: true` and `transform: true`:

- Unknown fields are silently stripped from the request body
- Path/query params are auto-coerced to declared types
- Invalid bodies return HTTP 400

## Test

```bash
# unit tests
npm test

# watch mode
npm run test:watch

# coverage
npm run test:cov
```

```bash
# run CRUD smoke test against Neon
npm run crud:test
```

## Project structure

```
src/
├── app.module.ts
├── main.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── tasks/
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── pagination.dto.ts
│   │   └── update-task.dto.ts
│   ├── tasks.controller.ts
│   ├── tasks.module.ts
│   ├── tasks.service.ts
│   └── tasks.stats.service.ts
└── users/
    ├── dto/
    │   └── create-user.dto.ts
    ├── users.controller.ts
    ├── users.module.ts
    └── users.service.ts
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

## Docs

- [`docs/spec/checklist.md`](docs/spec/checklist.md) — Day 3 checklist
- [`docs/spec/day-6-checklist.md`](docs/spec/day-6-checklist.md) — Day 6 checklist (Prisma, users, pagination, error handling)
- [`docs/notes/`](docs/notes/) — NestJS and Prisma concept notes
