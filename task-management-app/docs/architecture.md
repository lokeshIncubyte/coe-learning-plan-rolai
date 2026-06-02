# Architecture

**Schema**: [Internal types & DTOs](./schema-internal.md) · **API**: [HTTP contract](./api-contract.md)

---

## Layers

```text
HTTP client
  → Controller  (route binding, @Body extraction, HTTP status)
      → Service  (business logic, in-memory state)
          → (Repository / DB)  ← planned; not built in day-3
```

- Controllers ([`tasks.controller.ts`](../backend/src/tasks/tasks.controller.ts)) do not hold state or business logic — they delegate everything to the service.
- Services ([`tasks.service.ts`](../backend/src/tasks/tasks.service.ts)) do not read the raw `Request` object or reference NestJS HTTP primitives.
- Validation happens at the HTTP boundary via a global `ValidationPipe` before the controller method is called — see [`main.ts`](../backend/src/main.ts).

---

## Folder structure

```text
src/
  main.ts                         ← bootstrap, global ValidationPipe
  app.module.ts                   ← root module, imports TasksModule
  app.controller.ts               ← scaffold root route (GET /)
  app.service.ts                  ← scaffold hello-world service
  tasks/
    task.interface.ts             ← Task interface + TaskStatus type
    tasks.module.ts               ← declares TasksController + TasksService
    tasks.controller.ts           ← GET /tasks, POST /tasks
    tasks.service.ts              ← in-memory store, getAll(), create()
    dto/
      create-task.dto.ts          ← CreateTaskDto with class-validator decorators
```

---

## Module responsibilities

| Module | Role | Owns | Does not own |
|--------|------|------|--------------|
| `AppModule` ([`app.module.ts`](../backend/src/app.module.ts)) | Root module; wires the application together | Imports `TasksModule`; declares scaffold `AppController` | Business logic |
| `TasksModule` ([`tasks/tasks.module.ts`](../backend/src/tasks/tasks.module.ts)) | Feature module for the Tasks resource | `TasksController`, `TasksService` | Persistence (in-memory only; DB layer planned) |
| `TasksController` ([`tasks/tasks.controller.ts`](../backend/src/tasks/tasks.controller.ts)) | HTTP interface for tasks | Route decorators, `@Body()` extraction, return value | State, UUIDs, business rules |
| `TasksService` ([`tasks/tasks.service.ts`](../backend/src/tasks/tasks.service.ts)) | Business logic + in-memory store | `Task[]` array, UUID generation, `getAll()`, `create()` | HTTP concerns, validation |

---

## Data flow

**Read path — `GET /tasks`**

```text
GET /tasks
  → TasksController.getAllTasks()
      → TasksService.getAll()
          → returns Task[]
  ← 200 JSON array
```

**Write path — `POST /tasks` (valid body)**

```text
POST /tasks  { title, description }
  → ValidationPipe transforms + validates CreateTaskDto
  → TasksController.createTask(dto)
      → TasksService.create(dto)
          → crypto.randomUUID() → new Task { id, title, description, status: 'OPEN' }
          → push to this.tasks[]
          → return Task
  ← 201 JSON task
```

**Validation-error path — `POST /tasks` (invalid body)**

```text
POST /tasks  {}  (or title: '')
  → ValidationPipe validates CreateTaskDto
      → @IsNotEmpty() fails on title
  → throws BadRequestException (before controller is called)
  ← 400 { statusCode, error, message: [...] }
```

---

[← Index](../backend/README.md)
