# TDD Plan — Day 4 — Modules, Providers & DTOs

**Checklist:** [`day-4-checklist.md`](day-4-checklist.md) — §2 Refactor + §3 Build + §4 DTOs + §5 DI
**Cycles:** 6–14 (continuing from Day 3)

---

### Cycle 6 — `CreateTaskDto.status` with `@IsEnum`; harden `ValidationPipe`

**Branch:** `tdd/dto-status-field`

RED — two assertions, one commit:
- `tasks.service.spec.ts`: `service.create({ ..., status: 'IN_PROGRESS' })` → `task.status === 'IN_PROGRESS'` (fails: hardcoded `'OPEN'`)
- `tasks.validation.spec.ts`: POST `{ title: 'T', status: 'FLYING' }` → 400 (fails: no `@IsEnum`)

GREEN — `task.interface.ts`: convert `TaskStatus` to a real `enum`. `create-task.dto.ts`: add `@IsOptional() @IsEnum(TaskStatus) status?`. `tasks.service.ts`: use `dto.status ?? TaskStatus.OPEN`.

REFACTOR — `main.ts` + `tasks.validation.spec.ts`: `ValidationPipe({ whitelist: true, transform: true })`.

---

### Cycle 7 — `TasksService.getById()` returns task or throws `NotFoundException`

**Branch:** `tdd/tasks-service-getbyid`

RED — `tasks.service.spec.ts`: found → returns task; missing → throws `NotFoundException`. (fails: method doesn't exist)

GREEN — `tasks.service.ts`: `find` by id; throw `new NotFoundException(\`Task #${id} not found\`)` if absent.

---

### Cycle 8 — `GET /tasks/:id` → 200 or 404

**Branch:** `tdd/tasks-controller-getbyid`

RED — `tasks.controller.spec.ts`: `controller.getTaskById('1')` returns mocked task. (fails: method doesn't exist)

GREEN — `tasks.controller.ts`: `@Get(':id') getTaskById(@Param('id') id: string)` → `tasksService.getById(id)`.

---

### Cycle 9 — `TasksService.update()` patches task or throws `NotFoundException`

**Branch:** `tdd/tasks-service-update`

RED — `tasks.service.spec.ts`: partial update preserves untouched fields; missing id throws `NotFoundException`. (fails: method doesn't exist)

GREEN — `tasks.service.ts`: call `getById(id)` (reuses throw), spread `dto` in-place, return task.

---

### Cycle 10 — `PATCH /tasks/:id` → 200 or 404; `UpdateTaskDto`

**Branch:** `tdd/tasks-controller-patch`

RED — `tasks.controller.spec.ts`: `controller.updateTask('1', dto)` returns updated mock. (fails: method doesn't exist)

GREEN — `npm install @nestjs/mapped-types`. `update-task.dto.ts`: `PartialType(CreateTaskDto)`. `tasks.controller.ts`: `@Patch(':id') updateTask(@Param('id') id, @Body() dto: UpdateTaskDto)`.

---

### Cycle 11 — `TasksService.remove()` deletes task or throws `NotFoundException`

**Branch:** `tdd/tasks-service-remove`

RED — `tasks.service.spec.ts`: after `remove()` → `getAll()` is empty; missing id throws `NotFoundException`. (fails: method doesn't exist)

GREEN — `tasks.service.ts`: call `getById(id)`, then `this.tasks = this.tasks.filter(t => t.id !== id)`.

---

### Cycle 12 — `DELETE /tasks/:id` → 204 or 404

**Branch:** `tdd/tasks-controller-delete`

RED — `tasks.controller.spec.ts`: `controller.removeTask('1')` calls `service.remove('1')`. (fails: method doesn't exist)

GREEN — `tasks.controller.ts`: `@Delete(':id') @HttpCode(204) removeTask(@Param('id') id)` → `tasksService.remove(id)`.

---

### Cycle 13 — `TaskStatsService.getStats()` returns `{ total, open }`

**Branch:** `tdd/task-stats-service`

RED — `tasks.stats.service.spec.ts` *(new)*: mocked `getAll()` returns 2 tasks (1 OPEN, 1 DONE) → `{ total: 2, open: 1 }`. (fails: class doesn't exist)

GREEN — `tasks.stats.service.ts`: inject `TasksService`, filter `getAll()` by `TaskStatus.OPEN`.

REFACTOR — `tasks.module.ts`: register `TaskStatsService` in providers (production wiring).

---

### Cycle 14 — `GET /tasks/stats` delegates to `TaskStatsService`

**Branch:** `tdd/tasks-controller-stats`

RED — `tasks.controller.spec.ts`: add `TaskStatsService` mock to `beforeEach`; assert `controller.getStats()` returns mock stats. (fails: method doesn't exist)

GREEN — `tasks.controller.ts`: inject `TaskStatsService`; add `@Get('stats') getStats()` **before** `@Get(':id')` to prevent NestJS route shadowing.

---

## Mapping table

| Checklist item | Cycle |
|---|---|
| `whitelist: true` / `transform: true` on ValidationPipe | 6 REFACTOR |
| `CreateTaskDto.status` with `@IsEnum` | 6 |
| `TasksService.getById()` | 7 |
| `GET /tasks/:id` | 8 |
| `TasksService.update()` | 9 |
| `UpdateTaskDto` (`PartialType`) + `PATCH /tasks/:id` | 10 |
| `TasksService.remove()` | 11 |
| `DELETE /tasks/:id` | 12 |
| `TaskStatsService` | 13 |
| `GET /tasks/stats` | 14 |
