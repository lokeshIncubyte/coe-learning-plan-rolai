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
- [x] Prisma migrations: `prisma migrate dev` vs `prisma migrate deploy`, migration files → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)
- [x] Prisma Client: generated typed client, `findMany`, `findUnique`, `create`, `update`, `delete` patterns → [`postgresql-prisma-concepts-map.md`](../postgresql-prisma-concepts-map.md)

## 2. Setup — PostgreSQL
- [x] Install PostgreSQL locally **or** use cloud — using Neon cloud PostgreSQL
- [x] Verify connection — `SELECT version()` returns PostgreSQL 17.8
- [x] Database available: Neon provides `neondb`
- [x] Add `DATABASE_URL` to `.env` with Neon connection string (`sslmode=require`)
- [x] `.env` confirmed in `.gitignore`; `.env.example` committed

## 3. Prisma — install and initialise
- [x] Install Prisma CLI and client: `npm install prisma @prisma/client`
- [x] Initialise Prisma: `npx prisma init` — Prisma 7 generates `prisma/schema.prisma` + `prisma.config.ts`
- [x] `provider = "postgresql"` set in `datasource db` block

## 4. Schema — define Task model
- [x] Define `Task` model in `prisma/schema.prisma` with fields:
  - `id` — `String @id @default(uuid())`
  - `title` — `String`
  - `description` — `String?`
  - `status` — `TaskStatus @default(OPEN)`
  - `createdAt` — `DateTime @default(now())`
  - `updatedAt` — `DateTime @updatedAt`
- [x] Define `TaskStatus` enum: `OPEN`, `IN_PROGRESS`, `DONE`

## 5. Migrations — apply schema to database
- [x] Run first migration: `npx prisma migrate dev --name init`
- [x] Migration file created: `prisma/migrations/20260507100827_init/migration.sql`
- [x] `Task` table and `TaskStatus` enum confirmed in Neon database
- [x] Prisma Client generated: `generated/prisma/` updated

## 6. Connect NestJS — PrismaService
- [x] Create `src/prisma/prisma.service.ts` extending `PrismaClient`, implementing `OnModuleInit` and `OnModuleDestroy`
- [x] Create `src/prisma/prisma.module.ts` — declare `PrismaService` as provider, export it, mark `@Global()`
- [x] Import `PrismaModule` in `AppModule`

## 7. Practice — Prisma Client CRUD
- [x] Write a small throwaway script or spec that exercises `prisma.task.create()`, `findMany()`, `findUnique()`, `update()`, `delete()` against the real Neon database
- [x] Confirm results are persisted (data visible in Prisma Studio or via `psql`)

## 8. Ship
- [x] All existing tests still pass (`npm test`)
- [x] `README.md` updated with Prisma/Neon setup instructions and `DATABASE_URL` note
- [x] Commit with a clean message
- [x] Push to GitHub

---

## Success Criteria (from requirements)
- [x] PostgreSQL installed and running
- [x] Prisma schema defines `Task` model with all required fields
- [x] `TaskStatus` enum declared in schema
- [x] Migration runs without errors; `Task` table present in database
- [x] Prisma Client generated
- [x] `PrismaService` wired into NestJS DI container via `PrismaModule`
- [x] Basic CRUD operations work against the database via Prisma Client
- [x] Existing tests still pass
