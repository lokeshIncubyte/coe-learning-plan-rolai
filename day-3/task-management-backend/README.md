# Task Management Backend

NestJS REST API — Day 3 of the CoE learning plan. In-memory task store with `GET` and `POST` endpoints and request validation.

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
| GET | `/tasks` | — | `Task[]` |
| POST | `/tasks` | `{ title: string, description?: string }` | `Task` |

### Task shape

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "OPEN"
}
```

### Validation

`POST /tasks` requires a non-empty `title`. Invalid requests return HTTP 400:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["title should not be empty"]
}
```

## Test

```bash
# unit + integration tests
npm test

# watch mode
npm run test:watch

# coverage
npm run test:cov
```

## Project structure

```
src/
├── app.module.ts
├── main.ts
└── tasks/
    ├── dto/
    │   └── create-task.dto.ts
    ├── task.interface.ts
    ├── tasks.controller.ts
    ├── tasks.module.ts
    └── tasks.service.ts
```

## Docs

- [`docs/spec/requirements.md`](docs/spec/requirements.md) — original requirements
- [`docs/spec/checklist.md`](docs/spec/checklist.md) — day checklist
- [`docs/notes/`](docs/notes/) — NestJS concept notes
