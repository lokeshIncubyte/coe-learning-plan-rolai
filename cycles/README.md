# TDD Cycles

Red→Green→Refactor cycle plans for the **Task Management backend**, grouped by day. Each day's checklist lives in [`../checklists/`](../checklists/).

```
cycles/
├── day-3/   tdd-plan.md                         # Tasks API (in-memory)
├── day-4/   tdd-plan.md                         # Modules, Providers, DTOs, CRUD
├── day-5/   001–004                             # Prisma schema + NestJS wiring
└── day-6/   005–025                             # Prisma service, users, pagination, errors
```

## Index

| Day | Plan / cycles | Covers | Status |
|-----|---------------|--------|--------|
| 3 | [`day-3/tdd-plan.md`](day-3/tdd-plan.md) | Tasks API, validation (in-memory store) | ✅ done |
| 4 | [`day-4/tdd-plan.md`](day-4/tdd-plan.md) | Full CRUD, `UpdateTaskDto`, `TaskStatsService` | ✅ done |
| 5 | [`day-5/001-task-model-schema.md`](day-5/001-task-model-schema.md) | Prisma `Task` model + schema | ✅ done |
| 5 | [`day-5/002-prisma-service-lifecycle.md`](day-5/002-prisma-service-lifecycle.md) | `PrismaService` lifecycle hooks | ✅ done |
| 5 | [`day-5/003-prisma-module-global.md`](day-5/003-prisma-module-global.md) | `@Global() PrismaModule` | ✅ done |
| 5 | [`day-5/004-app-module-imports-prisma.md`](day-5/004-app-module-imports-prisma.md) | Wire `PrismaModule` into `AppModule` | ✅ done |
| 6 | [`day-6/005-014-replace-tasks-service-prisma.md`](day-6/005-014-replace-tasks-service-prisma.md) | Replace in-memory `TasksService` with Prisma | ✅ done |
| 6 | [`day-6/015-021-user-model-and-relation.md`](day-6/015-021-user-model-and-relation.md) | `User` model + one-to-many relation, Users module | ✅ done |
| 6 | [`day-6/022-024-pagination-get-tasks.md`](day-6/022-024-pagination-get-tasks.md) | `PaginationDto` + paginated `GET /tasks` | ✅ done |
| 6 | [`day-6/025-error-handling.md`](day-6/025-error-handling.md) | P2002→409, P2025→404 error mapping | ✅ done |
