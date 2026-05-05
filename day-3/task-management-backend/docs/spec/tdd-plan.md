# TDD Plan — Day 3 Tasks API

**Source checklist:** [`checklist.md`](checklist.md)
**Date:** 2026-04-29
**Cycles:** 5
**Covers:** checklist §3 Build + §4 Validate (§5 Verify smoke tests run in `/verify-day`, not here)

> **STATUS: ALL DAY 3 CYCLES MERGED** — Cycles 1–5 were implemented and squashed into `main` as commits `2b2bc6e` through `b5bc631` (non-standard commit format; Day 3 predated this plan format). Skip to Day 4 section. **First unmerged cycle: Cycle 6.**

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

---

# Day 4 — Modules, Providers & DTOs

**Source checklist:** [`day-4-checklist.md`](day-4-checklist.md)
**Date:** 2026-05-05
**Covers:** checklist §2 Refactor + §3 Build + §4 DTOs + §5 Service-to-service DI

> Cycle numbers continue from Day 3. Day 3 ended at Cycle 5.

---

## Day 4 Setup steps

Non-testable items absorbed into the first relevant GREEN:

- **`npm install @nestjs/mapped-types`** — absorbed into Cycle 8 GREEN (UpdateTaskDto).
---

### Cycle 6 — `POST /tasks` stores a caller-provided `status`; invalid enum value → 400

- **Branch**: `tdd/dto-status-field`
- **Behavior**: `CreateTaskDto` gains an optional `status` field validated by `@IsEnum(TaskStatus)`. When a valid status is provided it overrides the `'OPEN'` default. An invalid value is rejected with 400.
- **RED**:
  - **Test files (two assertions, one RED commit)**:
    1. `src/tasks/tasks.service.spec.ts` — add inside existing `describe`:
       ```ts
       it('create() uses caller-provided status when given', () => {
         const task = service.create({ title: 'T', description: '', status: 'IN_PROGRESS' });
         expect(task.status).toBe('IN_PROGRESS');
       });
       ```
    2. `src/tasks/tasks.validation.spec.ts` — add inside existing `describe`:
       ```ts
       it('rejects an invalid status value — expects 400', async () => {
         const response = await request(app.getHttpServer())
           .post('/tasks')
           .send({ title: 'T', status: 'FLYING' });
         expect(response.status).toBe(400);
       });
       ```
  - **Why they fail today**:
    1. `TasksService.create()` hardcodes `status: 'OPEN'` — the provided status is ignored. `expect('OPEN').toBe('IN_PROGRESS')` fails.
    2. No `@IsEnum` on `CreateTaskDto.status` — `FLYING` passes through unvalidated. Response is 201, not 400.
- **GREEN** — only what the failing tests demand:
  - Convert `TaskStatus` from a string literal union to a proper `enum` in `task.interface.ts` — required because `@IsEnum` needs a real enum object at runtime, not a type alias that is erased.
  - Add `@IsOptional() @IsEnum(TaskStatus)` to `CreateTaskDto.status`.
  - Update `TasksService.create()` signature: `dto: { title: string; description: string; status?: TaskStatus }`. Use `dto.status ?? TaskStatus.OPEN`.
  - **Files touched**: `src/tasks/task.interface.ts`, `src/tasks/dto/create-task.dto.ts`, `src/tasks/tasks.service.ts`
  - `main.ts` and `tasks.validation.spec.ts` are **not touched in GREEN** — neither failing test reaches `main.ts`.
- **REFACTOR**: Harden `ValidationPipe` with `{ whitelist: true, transform: true }` in `main.ts`; sync the same options into `tasks.validation.spec.ts` so the integration spec mirrors production config. No new behavior — extra fields were already unreachable via the DTO; `transform` prepares for typed `@Param` in later cycles.
  - **Files touched**: `src/main.ts`, `src/tasks/tasks.validation.spec.ts`

**Maps to `day-4-checklist.md` items**:
- `Enable whitelist: true on global ValidationPipe` *(REFACTOR step)*
- `Enable transform: true to auto-coerce path/query params to declared types` *(REFACTOR step)*
- `Add @IsEnum(TaskStatus) + @IsOptional() to CreateTaskDto.status`

---

### Cycle 7 — `TasksService.getById()` returns a task or throws `NotFoundException`

- **Branch**: `tdd/tasks-service-getbyid`
- **Behavior**: `getById(id)` returns the matching `Task` when found; throws `NotFoundException` with message `"Task #<id> not found"` when not found.
- **RED**:
  - **Test file**: `src/tasks/tasks.service.spec.ts`
  - **Assertions**:
    ```ts
    it('getById() returns the task when it exists', () => {
      const task = service.create({ title: 'T', description: '' });
      expect(service.getById(task.id)).toStrictEqual(task);
    });

    it('getById() throws NotFoundException when task does not exist', () => {
      expect(() => service.getById('no-such-id')).toThrow(NotFoundException);
    });
    ```
  - **Why they fail**: `getById()` does not exist on `TasksService`.
- **GREEN**:
  - **Smallest change**: Add `getById(id: string): Task` to `TasksService`. Use `this.tasks.find(t => t.id === id)`. If not found, `throw new NotFoundException(\`Task #${id} not found\`)`.
  - **Files touched**: `src/tasks/tasks.service.ts`
- **REFACTOR**: None.

**Maps to `day-4-checklist.md` items**:
- `Add getById(id: string): Task to TasksService — throws NotFoundException when not found`

---

### Cycle 8 — `GET /tasks/:id` returns a single task (200) or 404

- **Branch**: `tdd/tasks-controller-getbyid`
- **Behavior**: `TasksController.getTaskById()` delegates to `TasksService.getById()` and returns the task. When the service throws `NotFoundException`, NestJS converts it to a 404 automatically.
- **RED**:
  - **Test file**: `src/tasks/tasks.controller.spec.ts`
  - **Assertion**:
    ```ts
    it('getTaskById() returns the task from the service', () => {
      jest.spyOn(tasksService, 'getById').mockReturnValue(mockTask);
      expect(controller.getTaskById('1')).toStrictEqual(mockTask);
    });
    ```
  - **Why it fails**: `getTaskById()` does not exist on `TasksController`.
- **GREEN**:
  - **Smallest change**: Add `@Get(':id')` `getTaskById(@Param('id') id: string): Task` to `TasksController`. Call `this.tasksService.getById(id)`.
  - **Files touched**: `src/tasks/tasks.controller.ts`
- **REFACTOR**: None.

**Maps to `day-4-checklist.md` items**:
- `GET /tasks/:id — return single task (200) or 404`

---

### Cycle 9 — `TasksService.update()` patches a task or throws `NotFoundException`

- **Branch**: `tdd/tasks-service-update`
- **Behavior**: `update(id, dto)` applies only the provided fields to the matching task and returns the updated task. Non-existent id throws `NotFoundException`.
- **RED**:
  - **Test file**: `src/tasks/tasks.service.spec.ts`
  - **Assertions**:
    ```ts
    it('update() applies partial fields and returns the updated task', () => {
      const task = service.create({ title: 'Old', description: 'desc' });
      const updated = service.update(task.id, { title: 'New' });
      expect(updated.title).toBe('New');
      expect(updated.description).toBe('desc');
      expect(updated.status).toBe('OPEN');
    });

    it('update() throws NotFoundException when task does not exist', () => {
      expect(() => service.update('ghost', { title: 'X' })).toThrow(NotFoundException);
    });
    ```
  - **Why they fail**: `update()` does not exist on `TasksService`.
- **GREEN**:
  - **Smallest change**: Add `update(id: string, dto: Partial<{ title: string; description: string; status: TaskStatus }>): Task`. Call `getById(id)` (reuse — already throws on missing). Spread `dto` over the found task in-place. Return the mutated task.
  - **Files touched**: `src/tasks/tasks.service.ts`
- **REFACTOR**: None.

**Maps to `day-4-checklist.md` items**:
- `Add update(id: string, dto: UpdateTaskDto): Task to TasksService`

---

### Cycle 10 — `PATCH /tasks/:id` updates a task and returns it (200) or 404

- **Branch**: `tdd/tasks-controller-patch`
- **Behavior**: `TasksController.updateTask()` delegates to `TasksService.update()` with the patched DTO and returns the result.
- **RED**:
  - **Test file**: `src/tasks/tasks.controller.spec.ts`
  - **Assertion**:
    ```ts
    it('updateTask() returns the updated task from the service', () => {
      const dto = { title: 'New' };
      const updated: Task = { ...mockTask, title: 'New' };
      jest.spyOn(tasksService, 'update').mockReturnValue(updated);
      expect(controller.updateTask('1', dto)).toStrictEqual(updated);
    });
    ```
  - **Why it fails**: `updateTask()` does not exist on `TasksController`.
- **GREEN**:
  - **Smallest change**: Install `@nestjs/mapped-types`. Create `src/tasks/dto/update-task.dto.ts` with `export class UpdateTaskDto extends PartialType(CreateTaskDto) {}`. Add `@Patch(':id')` `updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto): Task` to `TasksController`. Call `this.tasksService.update(id, dto)`.
  - **Files touched**: `src/tasks/tasks.controller.ts`, `src/tasks/dto/update-task.dto.ts` *(new)*, `package.json`
- **REFACTOR**: None.

**Maps to `day-4-checklist.md` items**:
- `Install @nestjs/mapped-types`
- `Create UpdateTaskDto using PartialType(CreateTaskDto)`
- `Wire UpdateTaskDto into TasksController.updateTask()`
- `PATCH /tasks/:id — partial update, return updated task (200) or 404`

---

### Cycle 11 — `TasksService.remove()` deletes a task or throws `NotFoundException`

- **Branch**: `tdd/tasks-service-remove`
- **Behavior**: `remove(id)` removes the matching task from the store. Non-existent id throws `NotFoundException`.
- **RED**:
  - **Test file**: `src/tasks/tasks.service.spec.ts`
  - **Assertions**:
    ```ts
    it('remove() deletes the task so getAll() no longer returns it', () => {
      const task = service.create({ title: 'T', description: '' });
      service.remove(task.id);
      expect(service.getAll()).toHaveLength(0);
    });

    it('remove() throws NotFoundException when task does not exist', () => {
      expect(() => service.remove('ghost')).toThrow(NotFoundException);
    });
    ```
  - **Why they fail**: `remove()` does not exist on `TasksService`.
- **GREEN**:
  - **Smallest change**: Add `remove(id: string): void`. Call `getById(id)` (throws on missing). Filter out the task: `this.tasks = this.tasks.filter(t => t.id !== id)`.
  - **Files touched**: `src/tasks/tasks.service.ts`
- **REFACTOR**: None.

**Maps to `day-4-checklist.md` items**:
- `Add remove(id: string): void to TasksService`

---

### Cycle 12 — `DELETE /tasks/:id` removes a task (204) or returns 404

- **Branch**: `tdd/tasks-controller-delete`
- **Behavior**: `TasksController.removeTask()` delegates to `TasksService.remove()` and returns no body with HTTP 204.
- **RED**:
  - **Test file**: `src/tasks/tasks.controller.spec.ts`
  - **Assertion**:
    ```ts
    it('removeTask() calls service.remove() with the given id', () => {
      const spy = jest.spyOn(tasksService, 'remove').mockReturnValue();
      controller.removeTask('1');
      expect(spy).toHaveBeenCalledWith('1');
    });
    ```
  - **Why it fails**: `removeTask()` does not exist on `TasksController`.
- **GREEN**:
  - **Smallest change**: Add `@Delete(':id')` `@HttpCode(204)` `removeTask(@Param('id') id: string): void` to `TasksController`. Call `this.tasksService.remove(id)`.
  - **Files touched**: `src/tasks/tasks.controller.ts`
- **REFACTOR**: None.

**Maps to `day-4-checklist.md` items**:
- `DELETE /tasks/:id — remove task, return 204 (no body) or 404`

---

### Cycle 13 — `TaskStatsService` counts total and open tasks via service-to-service DI

- **Branch**: `tdd/task-stats-service`
- **Behavior**: `TaskStatsService.getStats()` returns `{ total: number; open: number }` by reading from the injected `TasksService`. `GET /tasks/stats` exposes it.
- **RED**:
  - **Test file**: `src/tasks/tasks.stats.service.spec.ts` *(new)*
  - **Assertion**:
    ```ts
    it('getStats() returns total and open count from TasksService', () => {
      jest.spyOn(tasksService, 'getAll').mockReturnValue([
        { id: '1', title: 'A', description: '', status: 'OPEN' },
        { id: '2', title: 'B', description: '', status: 'DONE' },
      ]);
      expect(statsService.getStats()).toStrictEqual({ total: 2, open: 1 });
    });
    ```
  - **Why it fails**: `TaskStatsService` does not exist.
- **GREEN**:
  - **Smallest change**: Create `src/tasks/tasks.stats.service.ts` with `@Injectable() TaskStatsService` that injects `TasksService` and implements `getStats()`. Register `TaskStatsService` in `TasksModule.providers`. Add `@Get('stats')` `getStats()` to `TasksController`, injecting `TaskStatsService` alongside `TasksService`.
  - **Files touched**: `src/tasks/tasks.stats.service.ts` *(new)*, `src/tasks/tasks.stats.service.spec.ts` *(new)*, `src/tasks/tasks.module.ts`, `src/tasks/tasks.controller.ts`
- **REFACTOR**: None.

**Maps to `day-4-checklist.md` items**:
- `Create TaskStatsService (@Injectable) — exposes getStats()`
- `Inject TasksService into TaskStatsService via constructor injection`
- `Register TaskStatsService as a provider in TasksModule`
- `Add GET /tasks/stats route to TasksController using TaskStatsService`

---

## Day 4 Mapping table

| Day-4-checklist item | Cycle |
|---|---|
| `whitelist: true` on ValidationPipe | Cycle 6 GREEN |
| `transform: true` on ValidationPipe | Cycle 6 GREEN |
| `CreateTaskDto.status` with `@IsEnum` | Cycle 6 |
| `TasksService.getById()` | Cycle 7 |
| `GET /tasks/:id` route | Cycle 8 |
| `TasksService.update()` | Cycle 9 |
| `UpdateTaskDto` with `PartialType` | Cycle 10 GREEN |
| `PATCH /tasks/:id` route | Cycle 10 |
| `TasksService.remove()` | Cycle 11 |
| `DELETE /tasks/:id` route | Cycle 12 |
| `TaskStatsService` + service-to-service DI | Cycle 13 |
| `GET /tasks/stats` route | Cycle 13 GREEN |

**Gaps**: None. Every §2 Refactor + §3 Build + §4 DTOs + §5 DI checklist item maps to a cycle.
