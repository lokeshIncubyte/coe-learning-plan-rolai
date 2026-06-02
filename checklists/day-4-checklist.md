# Day 4 Checklist — NestJS Modules, Providers & DTOs

**Project:** Task Management App — backend architecture improvements
**Reference:** [`day-4-requirements.md`](day-4-requirements.md), NestJS docs (modules, providers, validation)
**Directory:** continues in `day-3/task-management-backend/`

---

## 1. Learn — concepts before code
- [ ] NestJS modules deep dive: feature modules, shared modules, re-exporting, global modules → [`06-modules-deep-dive.md`](../task-management-app/docs/notes/06-modules-deep-dive.md)
- [ ] Providers and DI patterns: `@Injectable`, custom providers, service-to-service injection → [`07-providers-di.md`](../task-management-app/docs/notes/07-providers-di.md)
- [ ] DTOs and mapped types: `PartialType`, `PickType`, `OmitType` from `@nestjs/mapped-types` → [`08-dtos-mapped-types.md`](../task-management-app/docs/notes/08-dtos-mapped-types.md)
- [ ] Exception handling: `NotFoundException`, `HttpException` hierarchy, throwing from services → [`09-exception-handling.md`](../task-management-app/docs/notes/09-exception-handling.md)
- [ ] `ValidationPipe` options: `whitelist`, `forbidNonWhitelisted`, `transform` → absorb into note 08 or 09

## 2. Refactor — harden existing API
- [x] Enable `whitelist: true` on global `ValidationPipe` (strips unknown fields from body)
- [x] Enable `transform: true` to auto-coerce path/query params to declared types
- [x] Add `@IsEnum(TaskStatus)` + `@IsOptional()` to `CreateTaskDto.status` so callers can override the default

## 3. Build — complete CRUD
- [x] Add `getById(id: string): Task` to `TasksService` — throws `NotFoundException` when not found
- [x] Add `update(id: string, dto: UpdateTaskDto): Task` to `TasksService` — throws `NotFoundException` when not found
- [x] Add `remove(id: string): void` to `TasksService` — throws `NotFoundException` when not found
- [x] `GET /tasks/:id` — return single task (200) or 404
- [x] `PATCH /tasks/:id` — partial update, return updated task (200) or 404
- [x] `DELETE /tasks/:id` — remove task, return 204 (no body) or 404

## 4. DTOs — UpdateTaskDto
- [x] Install `@nestjs/mapped-types`
- [x] Create `UpdateTaskDto` using `PartialType(CreateTaskDto)` — all fields optional, validators inherited
- [x] Wire `UpdateTaskDto` into `TasksController.updateTask()`

## 5. Service-to-service DI
- [x] Create `TaskStatsService` (`@Injectable`) — exposes `getStats(): { total: number; open: number }` by reading from `TasksService`
- [x] Inject `TasksService` into `TaskStatsService` via constructor injection
- [x] Register `TaskStatsService` as a provider in `TasksModule`
- [x] Add `GET /tasks/stats` route to `TasksController` using `TaskStatsService`

## 6. Verify — manual smoke tests
- [x] `GET /tasks/:id` with valid id → 200 with task object
- [x] `GET /tasks/:id` with unknown id → 404 with `{ statusCode: 404, message: "Task #<id> not found" }`
- [x] `PATCH /tasks/:id` with valid id + partial body → 200 with updated task
- [x] `PATCH /tasks/:id` with unknown id → 404
- [x] `DELETE /tasks/:id` with valid id → 204 (empty body)
- [x] `DELETE /tasks/:id` with unknown id → 404
- [x] `POST /tasks` with extra unknown field → 201, unknown field stripped from response
- [x] `GET /tasks/stats` → 200 with `{ total, open }` counts

## 7. Ship
- [x] All existing tests still pass (`npm test`)
- [x] New tests cover `getById`, `update`, `remove`, and `TaskStatsService`
- [x] `README.md` updated with new endpoints
- [ ] Commit with a clean message
- [ ] Push to GitHub

---

## Success Criteria (from requirements)
- [x] Full CRUD implemented for tasks
- [x] `UpdateTaskDto` uses `PartialType` — all fields optional, validation inherited
- [x] `NotFoundException` thrown from service layer (not controller)
- [x] `ValidationPipe` configured with `whitelist: true` and `transform: true`
- [x] Service-to-service dependency injection demonstrated via `TaskStatsService`
- [x] NestJS module boundaries respected — `TasksModule` owns all tasks providers
- [x] All tests pass
- [ ] Changes pushed to GitHub
