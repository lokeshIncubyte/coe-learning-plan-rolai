# Internal schema

Types and shapes used inside the app. **HTTP contract**: [API contract](./api-contract.md).

---

## Status enum

Defined in [`src/tasks/task.interface.ts`](../src/tasks/task.interface.ts).

```ts
type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
```

String-typed literal union (not a numeric enum) — serialises to readable JSON without a reverse-mapping step. Day-3 only produces `'OPEN'`; the other values are defined now so future cycles that transition status don't need to change this type.

---

## Domain entity

Defined in [`src/tasks/task.interface.ts`](../src/tasks/task.interface.ts).

```ts
interface Task {
  id: string;          // server-generated (crypto.randomUUID())
  title: string;       // client-provided
  description: string; // client-provided (optional on input — see DTO below)
  status: TaskStatus;  // server-generated; always 'OPEN' on creation
}
```

| Field | Origin | Notes |
|-------|--------|-------|
| `id` | Server | UUID v4 via `crypto.randomUUID()` (Node built-in, no extra dep) |
| `title` | Client | Required; validated `@IsNotEmpty()` |
| `description` | Client | Optional on input; stored as `string` on the entity |
| `status` | Server | Hardcoded to `'OPEN'` at creation; status transitions not yet implemented |

Returned to clients as the response body of `POST /tasks` and as elements of `GET /tasks` — see [api-contract.md](./api-contract.md).

---

## DTO — input shape

Defined in [`src/tasks/dto/create-task.dto.ts`](../src/tasks/dto/create-task.dto.ts).

```ts
class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
```

`CreateTaskDto` is a **class** (not an interface) because `class-validator` decorators require class-level metadata emitted by `emitDecoratorMetadata`. An interface is erased at compile time and carries no runtime decorator information.

`description` is `@IsOptional()` — a POST body that omits `description` passes validation. The entity still stores it as `string`; callers that omit it receive `undefined` coerced to the field (acceptable for in-memory day-3 storage; a DB layer would enforce NOT NULL separately).

There is no separate output DTO — the `Task` entity is returned directly.

---

## Persistence store

Owned by [`TasksService`](../src/tasks/tasks.service.ts).

```ts
private tasks: Task[] = [];
```

In-memory array. **Throwaway** — resets on every server restart. Will be replaced by a database-backed repository in a future day.

---

## Cross-cutting implementation notes

- **IDs are server-generated** via `crypto.randomUUID()` (Node ≥ 19 built-in). Clients never send an `id` field; it is not on `CreateTaskDto`.
- **ValidationPipe is global** — registered in [`main.ts`](../src/main.ts) via `app.useGlobalPipes(new ValidationPipe())`. It intercepts every incoming request before the controller method is called.
- **`whitelist` not yet set** — the pipe is instantiated with defaults. Unknown extra fields in the body are passed through rather than stripped. Adding `new ValidationPipe({ whitelist: true })` in a future day would silently drop fields not on the DTO.
- **`import type`** is used for `Task` in decorated controller signatures — required by `isolatedModules: true` + `emitDecoratorMetadata: true` (TypeScript TS1272).

---

[← Index](../README.md)
