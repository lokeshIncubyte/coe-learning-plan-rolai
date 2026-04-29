# TDD Plan — Day 3 Tasks API

**Source checklist:** [`checklist.md`](checklist.md)
**Date:** 2026-04-29
**Cycles:** 5
**Covers:** checklist §3 Build + §4 Validate (§5 Verify smoke tests run in `/verify-day`, not here)

---

## Setup steps

These are non-testable items that get absorbed into the first relevant GREEN. No RED/GREEN structure.

- **Keep `app.controller.spec.ts`** — tests the scaffold's `GET /` → `Hello World!`. Not touched by tasks work; keep it passing throughout.
- **`Task` interface** — define at `src/tasks/task.interface.ts`. Absorbed into Cycle 1 GREEN.
- **CLI generators** (`nest g module tasks`, `nest g controller tasks`, `nest g service tasks`) — absorbed into the relevant cycle GREEN as manual file creation (keeps TDD control over file contents).
- **`npm install class-validator class-transformer`** — absorbed into Cycle 5 GREEN.

---

## Cycles

---

### Cycle 1 — `TasksService.getAll()` returns an empty array

- **Branch**: `tdd/tasks-service-getall`
- **Behavior**: A freshly instantiated `TasksService` holds no tasks. Calling `getAll()` returns an empty array — not undefined, not null, an actual `Task[]` with length zero.
- **RED**:
  - **Test file**: `src/tasks/tasks.service.spec.ts`
  - **Assertion**:
    ```ts
    expect(service.getAll()).toStrictEqual([]);
    ```
  - **Why it fails today**: `src/tasks/tasks.service.ts` does not exist. The import will fail at compile time.
- **GREEN**:
  - **Smallest change**: Create `src/tasks/task.interface.ts` (Task interface with `id`, `title`, `description`, `status`), create `src/tasks/tasks.service.ts` (`TasksService` with a private `tasks: Task[] = []` and `getAll()` returning it), create `src/tasks/tasks.module.ts` (`TasksModule` declaring + exporting `TasksService`), register `TasksModule` in `AppModule`.
  - **Files touched**: `src/tasks/task.interface.ts` *(new)*, `src/tasks/tasks.service.ts` *(new)*, `src/tasks/tasks.module.ts` *(new)*, `src/app.module.ts`
- **REFACTOR**: None yet.

**Maps to checklist items**:
- `Generate the tasks module: nest g module tasks`
- `Generate the service: nest g service tasks`
- `Define a Task model/interface (id, title, description, status)`
- `Implement TasksService with in-memory business logic (getAll, create)` *(partial — getAll only)*

---

### Cycle 2 — `TasksService.create()` adds a task and returns it

- **Branch**: `tdd/tasks-service-create`
- **Behavior**: Calling `create({ title, description })` appends a new task to the in-memory list, assigns a unique `id` (UUID string) and a default `status` of `'OPEN'`, and returns the created task. A subsequent `getAll()` reflects it.
- **RED**:
  - **Test file**: `src/tasks/tasks.service.spec.ts` *(add to existing describe block)*
  - **Assertion**:
    ```ts
    const task = service.create({ title: 'Buy milk', description: 'Full fat' });
    expect(task).toMatchObject({ title: 'Buy milk', description: 'Full fat', status: 'OPEN' });
    expect(typeof task.id).toBe('string');
    expect(service.getAll()).toHaveLength(1);
    expect(service.getAll()[0]).toStrictEqual(task);
    ```
  - **Why it fails today**: `create()` method does not exist on `TasksService` (after Cycle 1 GREEN, only `getAll()` exists).
- **GREEN**:
  - **Smallest change**: Add `create(dto: { title: string; description: string }): Task` to `TasksService`. Generate id with `crypto.randomUUID()` (Node built-in, no extra dep). Set `status: 'OPEN'`. Push to `this.tasks` and return.
  - **Files touched**: `src/tasks/tasks.service.ts`
- **REFACTOR**: Extract a `TaskStatus` enum (`OPEN`) into `task.interface.ts` if the literal string `'OPEN'` appears in more than one place after GREEN.

**Maps to checklist items**:
- `Implement TasksService with in-memory business logic (getAll, create)` *(completes)*
- `GET /tasks — return all tasks` *(service side confirmed here)*
- Covers verify item: *Subsequent `GET /tasks` reflects the created task* (at service level)

---

### Cycle 3 — `GET /tasks` controller route delegates to `TasksService`

- **Branch**: `tdd/tasks-controller-get`
- **Behavior**: `TasksController.getAllTasks()` calls `TasksService.getAll()` and returns whatever the service returns. The controller owns the route; the service owns the data.
- **RED**:
  - **Test file**: `src/tasks/tasks.controller.spec.ts`
  - **Assertion**:
    ```ts
    // tasksService.getAll is mocked to return [{ id: '1', title: 'T', description: '', status: 'OPEN' }]
    expect(controller.getAllTasks()).toStrictEqual([{ id: '1', title: 'T', description: '', status: 'OPEN' }]);
    ```
  - **Why it fails today**: `src/tasks/tasks.controller.ts` does not exist.
- **GREEN**:
  - **Smallest change**: Create `src/tasks/tasks.controller.ts` with `@Controller('tasks')` and a `@Get()` `getAllTasks()` method that calls `this.tasksService.getAll()`. Add `TasksController` to `TasksModule`. Wire `TasksService` via constructor injection.
  - **Files touched**: `src/tasks/tasks.controller.ts` *(new)*, `src/tasks/tasks.module.ts`
- **REFACTOR**: None yet.

**Maps to checklist items**:
- `Generate the controller: nest g controller tasks`
- `Wire TasksService into TasksController via constructor injection`
- `GET /tasks — return all tasks`

---

### Cycle 4 — `POST /tasks` controller route creates and returns a task

- **Branch**: `tdd/tasks-controller-post`
- **Behavior**: Calling `POST /tasks` with a valid `{ title, description }` body creates a task via `TasksService.create()` and returns the created task object to the caller.
- **RED**:
  - **Test file**: `src/tasks/tasks.controller.spec.ts` *(add to existing describe block)*
  - **Assertion**:
    ```ts
    const dto = { title: 'Write tests', description: 'Red first' };
    const expected = { id: 'abc', title: 'Write tests', description: 'Red first', status: 'OPEN' };
    jest.spyOn(tasksService, 'create').mockReturnValue(expected);
    expect(controller.createTask(dto)).toStrictEqual(expected);
    ```
  - **Why it fails today**: `createTask()` method does not exist on `TasksController` (after Cycle 3 GREEN, only `getAllTasks()` exists).
- **GREEN**:
  - **Smallest change**: Add `@Post()` `createTask(@Body() dto: CreateTaskDto): Task` to `TasksController`. Create `src/tasks/dto/create-task.dto.ts` with `title: string` and `description: string` (no validators yet — that's Cycle 5). Call `this.tasksService.create(dto)` and return the result.
  - **Files touched**: `src/tasks/tasks.controller.ts`, `src/tasks/dto/create-task.dto.ts` *(new)*
- **REFACTOR**: None yet.

**Maps to checklist items**:
- `POST /tasks — create a new task from request body`
- `Create CreateTaskDto` *(structure only; validators added in Cycle 5)*

---

### Cycle 5 — `POST /tasks` rejects a missing/empty title with HTTP 400

- **Branch**: `tdd/tasks-validation`
- **Behavior**: When `POST /tasks` is called with an empty or missing `title`, the global `ValidationPipe` intercepts the request and returns a `400 Bad Request` with a structured error body — before the controller method is ever called.
- **RED**:
  - **Test file**: `src/tasks/tasks.validation.spec.ts`
  - **Assertion** (integration-level — uses `createTestingModule` + `app.useGlobalPipes`):
    ```ts
    // POST with body {} or { title: '' } → response.statusCode === 400
    const response = await request(app.getHttpServer()).post('/tasks').send({});
    expect(response.status).toBe(400);
    ```
  - **Why it fails today**: `ValidationPipe` is not globally enabled in `main.ts`. `CreateTaskDto` has no validation decorators. A POST with `{}` currently passes straight through to the controller.
- **GREEN**:
  - **Smallest change**: `npm install class-validator class-transformer`. Enable `app.useGlobalPipes(new ValidationPipe())` in `main.ts`. Add `@IsString()` + `@IsNotEmpty()` to `CreateTaskDto.title`. Add `@IsOptional()` + `@IsString()` to `CreateTaskDto.description`.
  - **Files touched**: `src/main.ts`, `src/tasks/dto/create-task.dto.ts`, `package.json` / `package-lock.json`
- **REFACTOR**: None yet — the DTO is minimal by design for Day 3.

**Maps to checklist items**:
- `Install class-validator and class-transformer`
- `Enable ValidationPipe globally in main.ts`
- `Create CreateTaskDto with validation decorators (@IsString, @IsNotEmpty, @IsOptional, etc.)`
- `Verify invalid POST bodies are rejected with a 400 response`

---

## Mapping table

| Checklist item | Cycle |
|---|---|
| Generate tasks module | Cycle 1 GREEN |
| Generate controller | Cycle 3 GREEN |
| Generate service | Cycle 1 GREEN |
| Define Task model/interface | Cycle 1 GREEN |
| `TasksService.getAll()` | Cycle 1 |
| `TasksService.create()` | Cycle 2 |
| Wire `TasksService` → `TasksController` | Cycle 3 GREEN |
| `GET /tasks` route | Cycle 3 |
| `POST /tasks` route | Cycle 4 |
| Install `class-validator`, `class-transformer` | Cycle 5 GREEN |
| Enable `ValidationPipe` globally | Cycle 5 GREEN |
| `CreateTaskDto` (structure) | Cycle 4 GREEN |
| `CreateTaskDto` (validators) | Cycle 5 GREEN |
| Verify: invalid POST → 400 | Cycle 5 |
| Verify: `GET /tasks` → `[]` initially | Cycle 1 (unit) + `/verify-day` (smoke) |
| Verify: `POST /tasks` valid → task returned | Cycle 4 (unit) + `/verify-day` (smoke) |
| Verify: `GET /tasks` reflects created task | Cycle 2 (service) + `/verify-day` (smoke) |

**Gaps:** None. Every Build and Validate checklist item maps to a cycle. The three §5 Verify smoke-test items are covered at the unit level above and will be re-run as HTTP smoke tests in `/verify-day`.

---

## Adjustments log

No cycles were removed. All five passed the trivially-green check:

- **Cycle 1** — `TasksService` doesn't exist; test fails at import. ✅ Genuinely red.
- **Cycle 2** — `create()` doesn't exist on `TasksService` after Cycle 1 GREEN. ✅ Genuinely red.
- **Cycle 3** — `TasksController` doesn't exist. ✅ Genuinely red.
- **Cycle 4** — `createTask()` doesn't exist on `TasksController` after Cycle 3 GREEN. ✅ Genuinely red.
- **Cycle 5** — `ValidationPipe` not enabled; no DTO validators. POST with `{}` currently reaches the controller unblocked. ✅ Genuinely red.

**One tightening applied** (Cycle 2): changed `toEqual([...])` to `toHaveLength(1)` + `toStrictEqual(task)` to distinguish "array has one element equal to the returned task" from a weaker matcher. Guards against a `create()` that returns the task but doesn't actually persist it.

**One structural note**: Cycle 5 uses an integration-level spec rather than a pure unit test because `ValidationPipe` is a global NestJS pipe that only intercepts at the HTTP boundary. A unit test on the controller method would never see the 400 — the pipe acts before the method is called. This is the correct test shape for validation behavior.
