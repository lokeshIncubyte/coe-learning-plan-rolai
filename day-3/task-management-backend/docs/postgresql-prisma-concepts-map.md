# PostgreSQL & Prisma Concepts Map

> Day 5 reference — covers PostgreSQL fundamentals, Prisma ORM, and NestJS integration.
> Sources: [Neon PostgreSQL Tutorial](https://neon.com/postgresql/tutorial), [Prisma Docs](https://www.prisma.io/docs), [NestJS Prisma Recipe](https://docs.nestjs.com/recipes/prisma)

---

## 1. PostgreSQL Basics

### What it is
A relational database: data lives in **tables** (rows + columns), connected by **foreign keys**.

### Core data types
| Type | Use |
|---|---|
| `SERIAL` / `UUID` | Auto-increment or UUID primary key |
| `VARCHAR(n)` / `TEXT` | Strings |
| `INTEGER` / `BIGINT` | Whole numbers |
| `BOOLEAN` | true/false |
| `TIMESTAMP` | Date + time |
| `ENUM` | Restricted string values |

### Key constraints
- `PRIMARY KEY` — uniquely identifies each row
- `NOT NULL` — field is required
- `UNIQUE` — no duplicate values
- `DEFAULT` — value used when omitted
- `FOREIGN KEY` — links to another table's primary key

### Essential SQL (CRUD)
```sql
-- Create
INSERT INTO tasks (title, status) VALUES ('Buy milk', 'OPEN');

-- Read
SELECT * FROM tasks WHERE status = 'OPEN' ORDER BY created_at DESC;

-- Update
UPDATE tasks SET status = 'DONE' WHERE id = 'abc-123';

-- Delete
DELETE FROM tasks WHERE id = 'abc-123';
```

### Transactions
Wrap multiple statements so they all succeed or all roll back:
```sql
BEGIN;
UPDATE tasks SET status = 'IN_PROGRESS' WHERE id = '1';
INSERT INTO audit_log (task_id, action) VALUES ('1', 'status_change');
COMMIT;
-- or ROLLBACK; on error
```

---

## 2. Prisma Schema (`schema.prisma`)

### Three required blocks

```prisma
// 1. datasource — which database and how to connect
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 2. generator — what to generate (always Prisma Client)
generator client {
  provider = "prisma-client-js"
}

// 3. model — your data shape (maps to a DB table)
model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(OPEN)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  OPEN
  IN_PROGRESS
  DONE
}
```

### Field attributes cheat sheet
| Attribute | Meaning |
|---|---|
| `@id` | Primary key |
| `@default(uuid())` | Auto-generate UUID |
| `@default(now())` | Set to current timestamp on create |
| `@updatedAt` | Auto-set to now on every update |
| `?` (after type) | Field is optional (nullable) |
| `@unique` | Unique constraint |
| `@db.VarChar(255)` | Map to specific DB column type |

---

## 3. Prisma Migrations

```
schema.prisma  →  migrate dev  →  SQL migration file  →  DB table
                                       ↓
                               prisma generate
                                       ↓
                              node_modules/.prisma/client (typed)
```

### Commands
| Command | When to use |
|---|---|
| `npx prisma migrate dev --name <label>` | Development — creates + applies migration |
| `npx prisma migrate deploy` | Production / CI — applies pending migrations |
| `npx prisma migrate reset` | Dev only — drops DB and re-runs all migrations |
| `npx prisma migrate status` | Show which migrations are applied / pending |
| `npx prisma generate` | Regenerate client after schema change (auto-runs with `migrate dev`) |
| `npx prisma db push` | Apply schema without migration history (prototyping only) |
| `npx prisma studio` | Open visual DB browser at `localhost:5555` |

---

## 4. Prisma Client — query API

### Read
```ts
// all tasks
prisma.task.findMany()

// filtered + sorted
prisma.task.findMany({
  where: { status: TaskStatus.OPEN },
  orderBy: { createdAt: 'desc' },
})

// single by id (null if not found)
prisma.task.findUnique({ where: { id } })

// count
prisma.task.count()
prisma.task.count({ where: { status: TaskStatus.OPEN } })
```

### Write
```ts
// create
prisma.task.create({ data: { title, description, status } })

// partial update
prisma.task.update({ where: { id }, data: { status } })

// delete
prisma.task.delete({ where: { id } })
```

### P2025 — record not found error
Thrown by `update` and `delete` when `where` matches no row. Catch it to return a 404:
```ts
import { Prisma } from '@prisma/client';

try {
  return await this.prisma.task.update({ where: { id }, data: dto });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
    throw new NotFoundException(`Task #${id} not found`);
  }
  throw e;
}
```

---

## 5. NestJS Integration

### PrismaService
Wraps `PrismaClient` inside NestJS DI. Lifecycle hooks ensure the connection opens and closes cleanly.

```ts
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### PrismaModule (global)
Declare once in `AppModule`; every other module can inject `PrismaService` without re-importing.

```ts
// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Injecting into a service
```ts
// src/tasks/tasks.service.ts
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.task.findMany();
  }
}
```

### Data flow
```
HTTP Request
    ↓
Controller  (routing, param extraction)
    ↓
Service     (business logic, NotFoundException)
    ↓
PrismaService → PrismaClient → PostgreSQL
```

---

## 6. Environment setup

```
# .env  (never commit — already in .gitignore)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management"
```

```
# .env.example  (commit this — safe placeholder)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
```

---

## 7. Quick-reference: migrate dev vs db push

| | `migrate dev` | `db push` |
|---|---|---|
| Creates migration file | Yes | No |
| Safe for production | Via `migrate deploy` | No |
| Use case | Normal development | Quick prototyping |
| Regenerates client | Yes (automatic) | Yes |
