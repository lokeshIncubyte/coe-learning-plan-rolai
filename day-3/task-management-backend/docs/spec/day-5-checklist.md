# Day 5 Checklist — PostgreSQL & Prisma Setup

**Project:** Task Management App — add database layer
**Reference:** [`requirements.md`](requirements.md), Prisma docs, NestJS Prisma integration guide
**Directory:** continues in `day-3/task-management-backend/`

---

## 1. Learn — concepts before code
- [x] PostgreSQL basics: databases, tables, rows, data types, primary keys → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)
- [x] SQL fundamentals: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `WHERE`, `ORDER BY` → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)
- [x] Prisma ORM overview: what it is, why type-safe, how it differs from raw SQL / ActiveRecord ORMs → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)
- [x] Prisma schema language: `model`, field types, `@id`, `@default`, `@updatedAt`, enums → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)
- [x] Prisma migrations: `prisma migrate dev` vs `prisma migrate deploy`, migration files, shadow database → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)
- [x] Prisma Client: generated typed client, `findMany`, `findUnique`, `create`, `update`, `delete` patterns → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)

## 2. Setup — PostgreSQL running locally
- [x] Install PostgreSQL locally **or** spin up via Docker — using Neon cloud PostgreSQL instead
- [x] Verify connection: `psql -U postgres -c "\l"` shows databases list — Neon `neondb` pre-exists; verified via URL; full connectivity confirmed when Prisma migrates
- [x] Create a dedicated database: `CREATE DATABASE task_management;` — Neon provides `neondb` database
- [x] Add `DATABASE_URL` to `.env`: Neon connection string with `sslmode=require`
- [x] Add `.env` to `.gitignore` (verify it is already there) — confirmed at line 20

## 3. Prisma — install and initialise
- [x] Install Prisma CLI and client: `npm install prisma @prisma/client`
- [x] Initialise Prisma: `npx prisma init` — Prisma 7 generates `prisma/schema.prisma` + `prisma.config.ts` (URL lives here, not in schema)
- [x] Set `provider = "postgresql"` in `datasource db` block of `schema.prisma` — already set by init

## 4. Schema — define Task model
- [ ] Define `Task` model in `prisma/schema.prisma` with fields:
  - `id` — `String @id @default(uuid())`
  - `title` — `String`
  - `description` — `String?`
  - `status` — `TaskStatus` (enum: `OPEN`, `IN_PROGRESS`, `DONE`)
  - `createdAt` — `DateTime @default(now())`
  - `updatedAt` — `DateTime @updatedAt`
- [ ] Define `TaskStatus` enum in `schema.prisma`

## 5. Migrations — apply schema to database
- [ ] Run first migration: `npx prisma migrate dev --name init`
- [ ] Confirm migration file created under `prisma/migrations/`
- [ ] Confirm table `Task` exists in database: `psql -U postgres -d task_management -c "\dt"`
- [ ] Generate Prisma Client: `npx prisma generate` (auto-runs after migrate, verify `node_modules/.prisma/client` exists)

## 6. Connect NestJS — PrismaService
- [ ] Create `src/prisma/prisma.service.ts` extending `PrismaClient`, implementing `OnModuleInit` and `OnModuleDestroy`
- [ ] Create `src/prisma/prisma.module.ts` — declare `PrismaService` as provider, export it, mark `@Global()`
- [ ] Import `PrismaModule` in `AppModule`

## 7. Refactor — replace in-memory store with Prisma CRUD
- [ ] Inject `PrismaService` into `TasksService` (remove the `tasks: Task[]` array)
- [ ] `getAll()` → `prisma.task.findMany()`
- [ ] `getById(id)` → `prisma.task.findUnique({ where: { id } })` — throw `NotFoundException` if null
- [ ] `create(dto)` → `prisma.task.create({ data: { ...dto, status: dto.status ?? TaskStatus.OPEN } })`
- [ ] `update(id, dto)` → `prisma.task.update({ where: { id }, data: dto })` — catch Prisma `P2025` error and throw `NotFoundException`
- [ ] `remove(id)` → `prisma.task.delete({ where: { id } })` — catch Prisma `P2025` error and throw `NotFoundException`
- [ ] Update `TaskStatsService.getStats()` to call `prisma.task.count()` and `prisma.task.count({ where: { status: TaskStatus.OPEN } })`

## 8. Verify — smoke tests (all endpoints against real DB)
- [ ] `POST /tasks` with valid body → 201 with task object containing `id` (UUID), `createdAt`, `updatedAt`
- [ ] `GET /tasks` → 200 with array (includes the task just created)
- [ ] `GET /tasks/:id` with valid id → 200 with task object
- [ ] `GET /tasks/:id` with unknown id → 404
- [ ] `PATCH /tasks/:id` with `{ "status": "IN_PROGRESS" }` → 200 with updated task
- [ ] `DELETE /tasks/:id` with valid id → 204 (empty body)
- [ ] `DELETE /tasks/:id` with unknown id → 404
- [ ] `GET /tasks/stats` → 200 with correct `{ total, open }` counts from database
- [ ] Restart the server; previously created tasks survive (persisted in DB)

## 9. Ship
- [ ] All existing unit tests pass or are updated to mock `PrismaService` (`npm test`)
- [ ] `README.md` updated with PostgreSQL/Prisma setup instructions and `DATABASE_URL` note
- [ ] Commit with a clean message
- [ ] Push to GitHub

---

## Success Criteria (from requirements)
- [ ] PostgreSQL installed and running
- [ ] Prisma schema defines `Task` model with all required fields
- [ ] `TaskStatus` enum declared in schema and matches existing DTO/service enums
- [ ] Migration runs without errors; table present in database
- [ ] Prisma Client generated and accessible in `node_modules/.prisma/client`
- [ ] `PrismaService` wired into NestJS DI container via `PrismaModule`
- [ ] All CRUD routes operate against PostgreSQL (no in-memory array)
- [ ] Data persists across server restarts
- [ ] All tests pass
