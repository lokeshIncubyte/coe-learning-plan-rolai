# Day 6 Checklist — NestJS + Prisma Complete Backend

**Project:** Task Management App — replace in-memory store with database
**Reference:** [`requirements.md`](requirements.md), [`prisma-crud-relations-concepts-map.md`](../notes/prisma-crud-relations-concepts-map.md)
**Directory:** continues in `day-3/task-management-backend/`

---

## 1. Learn — concepts before code
- [x] Prisma Client CRUD methods: `findMany`, `findUnique`, `create`, `update`, `delete` → [`prisma-crud-relations-concepts-map.md`](../notes/prisma-crud-relations-concepts-map.md)
- [x] Filtering (`where`), ordering (`orderBy`), pagination (`skip`/`take`) → [`prisma-crud-relations-concepts-map.md`](../notes/prisma-crud-relations-concepts-map.md)
- [x] Prisma relations: one-to-many schema syntax, `@relation`, foreign key fields → [`prisma-crud-relations-concepts-map.md`](../notes/prisma-crud-relations-concepts-map.md)
- [x] Querying related data: `include`, nested `select`, nested writes → [`prisma-crud-relations-concepts-map.md`](../notes/prisma-crud-relations-concepts-map.md)
- [x] Error handling: `PrismaClientKnownRequestError`, codes `P2002`, `P2025` → [`prisma-crud-relations-concepts-map.md`](../notes/prisma-crud-relations-concepts-map.md)
- [x] Transactions: `prisma.$transaction([...])` and interactive transactions → [`prisma-crud-relations-concepts-map.md`](../notes/prisma-crud-relations-concepts-map.md)

## 2. Replace in-memory TasksService with Prisma
- [x] Inject `PrismaService` into `TasksService`
- [x] Rewrite `create()` — `prisma.task.create()`; return Prisma `Task` type
- [x] Rewrite `getAll()` — `prisma.task.findMany()`; make method async
- [x] Rewrite `getById()` — `prisma.task.findUnique()`; throw `NotFoundException` on null (replaces `P2025` path)
- [x] Rewrite `update()` — `prisma.task.update()`; catch `P2025` → `NotFoundException`
- [x] Rewrite `remove()` — `prisma.task.delete()`; catch `P2025` → `NotFoundException`
- [x] Delete `task.interface.ts` — use Prisma-generated `Task` type and `TaskStatus` enum everywhere
- [x] Update `TasksController` return types and async signatures
- [x] Update `TaskStatsService` — inject `PrismaService`, rewrite with `prisma.task.count()`
- [x] All existing controller tests still pass

## 3. User model and one-to-many relationship
- [ ] Add `User` model to `prisma/schema.prisma`:
  - `id` — `String @id @default(uuid())`
  - `name` — `String`
  - `email` — `String @unique`
  - `createdAt` — `DateTime @default(now())`
  - `tasks` — relation field `Task[]`
- [ ] Add `userId` foreign key to `Task` model (optional: `String?`) with `@relation`
- [ ] Run migration: `npx prisma migrate dev --name add-user-task-relation`
- [ ] Create `UsersModule`, `UsersService`, `UsersController`
- [ ] `POST /users` — create a user
- [ ] `GET /users/:id` — get a user with their tasks (`include: { tasks: true }`)

## 4. Pagination on GET /tasks
- [ ] Accept `?page=1&limit=10` query params (default: page 1, limit 10)
- [ ] Create `PaginationDto` with `@IsOptional`, `@IsInt`, `@Min(1)` validation
- [ ] Apply `skip = (page - 1) * limit`, `take = limit` in `findMany`
- [ ] Return `{ data: Task[], total: number, page: number, limit: number }`
- [ ] Update controller to accept `@Query() pagination: PaginationDto`

## 5. Database seeding
- [ ] Create `prisma/seed.ts` — seed 2 users and 5 tasks (mix of statuses, some assigned to users)
- [ ] Add `"prisma": { "seed": "npx tsx prisma/seed.ts" }` to `package.json`
- [ ] Run `npx prisma db seed` and confirm data in Neon

## 6. Error handling
- [ ] Catch `PrismaClientKnownRequestError` with code `P2002` (unique constraint) → HTTP 409
- [ ] Catch `P2025` (record not found) → HTTP 404 in all service methods
- [ ] No raw Prisma errors leak through to API responses

## 7. Ship
- [ ] All tests pass (`npm test`)
- [ ] `README.md` updated — new endpoints, pagination usage, seed command
- [ ] Commit and push

---

## Success Criteria
- [ ] `GET /tasks` queries Neon, not in-memory array
- [ ] All CRUD endpoints work end-to-end with the database
- [ ] `POST /users` creates a user; `GET /users/:id` returns user with tasks
- [ ] `GET /tasks?page=2&limit=5` returns the correct slice
- [ ] `npx prisma db seed` populates the database with test data
- [ ] Database errors map to correct HTTP status codes
