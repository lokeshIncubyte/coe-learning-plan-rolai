# API contract

**Internal types**: [schema-internal.md](./schema-internal.md) · **Architecture**: [architecture.md](./architecture.md)

---

## Global setup

| Setting | Value |
|---------|-------|
| **Dev base URL** | `http://localhost:3001` |
| **Port** | `3001` (hardcoded in [`main.ts`](../src/main.ts); port 3000 reserved on this machine) |
| **Content-Type** | `application/json` for all request bodies |
| **Validation** | Global `ValidationPipe` — every endpoint inherits the same 400 error envelope |

**Validation error envelope** (returned on any failed body validation):

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["<field> <constraint>", "..."]
}
```

---

## `GET /tasks`

| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **Path** | `/tasks` |
| **Request body** | none |
| **Success status** | `200 OK` |
| **Response body** | `Task[]` — see [`schema-internal.md → Domain entity`](./schema-internal.md#domain-entity) |

**Response shape**:

```ts
Task[]
// where Task = { id: string; title: string; description: string; status: TaskStatus }
```

**Example — empty store:**

```json
[]
```

**Example — after one POST:**

```json
[
  {
    "id": "816d612d-28bd-49d7-a8f8-29218c3c5d87",
    "title": "Buy milk",
    "description": "Full fat",
    "status": "OPEN"
  }
]
```

**Error paths**: none (read-only; always returns 200).

---

## `POST /tasks`

| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **Path** | `/tasks` |
| **Request body** | `CreateTaskDto` — see [`schema-internal.md → DTO input shape`](./schema-internal.md#dto--input-shape) |
| **Success status** | `201 Created` |
| **Response body** | `Task` — the newly created task |

**Request shape**:

```ts
{
  title: string;        // required — @IsString @IsNotEmpty
  description?: string; // optional — @IsOptional @IsString
}
```

**Example — valid request:**

```
POST /tasks
Content-Type: application/json

{ "title": "Buy milk", "description": "Full fat" }
```

```json
{
  "id": "816d612d-28bd-49d7-a8f8-29218c3c5d87",
  "title": "Buy milk",
  "description": "Full fat",
  "status": "OPEN"
}
```

**Example — omitting optional `description`:**

```
POST /tasks
Content-Type: application/json

{ "title": "Buy milk" }
```

```json
{
  "id": "3f2a1b8c-...",
  "title": "Buy milk",
  "description": null,
  "status": "OPEN"
}
```

**Error paths**:

| Status | Condition | Response body |
|--------|-----------|---------------|
| `400 Bad Request` | `title` missing or empty string | `{ "statusCode": 400, "error": "Bad Request", "message": ["title should not be empty", "title must be a string"] }` |
| `400 Bad Request` | `title` is empty string `""` | `{ "statusCode": 400, "error": "Bad Request", "message": ["title should not be empty"] }` |

---

## Planned

| Endpoint | Day | Notes |
|----------|-----|-------|
| `GET /tasks/:id` | future | Fetch single task by id |
| `PATCH /tasks/:id` | future | Update status or fields |
| `DELETE /tasks/:id` | future | Remove a task |

---

[← Index](../README.md)
