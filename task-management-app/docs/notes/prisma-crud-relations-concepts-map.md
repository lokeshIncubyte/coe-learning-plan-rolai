# Prisma CRUD & Relations — Concepts Map

> Audience: knows basic Prisma schema syntax, has a working `PrismaService` in NestJS.

---

## 1. Prisma Client CRUD

### 1.1 Read Operations

| Method | What it does | Returns |
|---|---|---|
| `findUnique` | Fetch one record by `@id` or `@unique` field | `T \| null` |
| `findFirst` | Fetch first record matching `where` | `T \| null` |
| `findMany` | Fetch all records matching `where` | `T[]` |

```ts
// findUnique — must use an @id or @unique field
const task = await prisma.task.findUnique({ where: { id: 1 } });

// findFirst — any field, returns first match
const task = await prisma.task.findFirst({ where: { status: 'TODO' } });

// findMany — returns array (empty array, never null)
const tasks = await prisma.task.findMany({ where: { status: 'IN_PROGRESS' } });
```

### 1.2 Write Operations

| Method | What it does | Returns |
|---|---|---|
| `create` | Insert one record | `T` (full record) |
| `createMany` | Insert many records | `{ count: number }` |
| `update` | Modify one record (must match a unique field) | `T` (updated record) |
| `updateMany` | Modify all records matching `where` | `{ count: number }` |
| `upsert` | Update if exists, create if not | `T` |
| `delete` | Remove one record (must match a unique field) | `T` (deleted record) |
| `deleteMany` | Remove all records matching `where` | `{ count: number }` |

```ts
// create
const task = await prisma.task.create({
  data: { title: 'Buy milk', status: 'TODO', userId: 1 },
});

// update
const task = await prisma.task.update({
  where: { id: 1 },
  data: { status: 'DONE' },
});

// upsert
const task = await prisma.task.upsert({
  where: { id: 1 },
  update: { status: 'DONE' },
  create: { title: 'Buy milk', status: 'TODO', userId: 1 },
});

// delete
const deleted = await prisma.task.delete({ where: { id: 1 } });

// deleteMany — returns count, not records
const { count } = await prisma.task.deleteMany({ where: { status: 'DONE' } });

// updateMany — atomic field operations supported
await prisma.task.updateMany({
  where: { userId: 1 },
  data: { status: 'DONE' },
});
```

### 1.3 Filtering (`where`)

```ts
// Equality
where: { status: 'TODO' }

// String operators
where: { title: { contains: 'milk' } }
where: { title: { startsWith: 'Buy', endsWith: 'milk' } }

// Numeric comparisons
where: { priority: { gt: 2 } }         // gt | gte | lt | lte

// Boolean operators
where: { OR: [{ status: 'TODO' }, { status: 'IN_PROGRESS' }] }
where: { AND: [{ userId: 1 }, { status: 'TODO' }] }
where: { NOT: { status: 'DONE' } }

// Relation filter — tasks that have at least one comment
where: { comments: { some: { text: { contains: 'urgent' } } } }
```

### 1.4 Ordering, Pagination, Field Selection

```ts
// orderBy — asc | desc
orderBy: { createdAt: 'desc' }
orderBy: [{ status: 'asc' }, { createdAt: 'desc' }]   // multi-field

// Pagination — skip + take (offset-based)
skip: 20, take: 10    // page 3, 10 items per page

// select — only specified fields are returned
select: { id: true, title: true, status: true }
// include — all fields + eager-loaded relations
include: { user: true }
// select and include cannot be combined at the top level
```

---

## 2. Relations in Prisma Schema

### 2.1 Relation Types

| Type | Schema keyword | DB artefact |
|---|---|---|
| One-to-one | `User?` / `Profile?` | FK on one side |
| One-to-many | `Task[]` / `User` | FK on the "many" side |
| Many-to-many (implicit) | `Tag[]` on both sides | Junction table auto-managed |
| Many-to-many (explicit) | Junction model defined manually | Full control over junction table |

### 2.2 One-to-Many: User → Tasks (project pattern)

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  tasks Task[]           // relation field — NOT a DB column
}

model Task {
  id     Int    @id @default(autoincrement())
  title  String
  status TaskStatus @default(TODO)

  userId Int             // scalar field — actual FK column in DB
  user   User @relation(fields: [userId], references: [id])
}
```

### 2.3 One-to-One

```prisma
model User    { profile Profile? }
model Profile {
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

### 2.4 Many-to-Many (implicit)

```prisma
model Post { tags  Tag[]  }
model Tag  { posts Post[] }
// Prisma auto-creates _PostToTag join table
```

### 2.5 `@relation` Breakdown

| Argument | Purpose |
|---|---|
| `fields` | Scalar fields on **this** model that hold the FK value |
| `references` | Fields on the **other** model being pointed to |
| `name` | Disambiguates when two relations exist between same models |
| `onDelete` | Referential action: `Cascade`, `Restrict`, `SetNull`, `NoAction` |

> Rule: `@relation(fields, references)` is required on the **FK side** (the "many" in 1-n).
> The other side is a plain list field — no `@relation` needed unless disambiguating.

---

## 3. Querying Related Data

### 3.1 `include` — Eager Load

```ts
// Fetch task with its user
const task = await prisma.task.findUnique({
  where: { id: 1 },
  include: { user: true },
});
// task.user is now the full User object

// Fetch user with all their tasks
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { tasks: true },
});
```

### 3.2 `select` with Nested Fields

```ts
// Only pick specific fields from both models
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    email: true,
    tasks: {
      select: { id: true, title: true, status: true },
    },
  },
});
```

### 3.3 Filter / Order Nested Relations

```ts
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    tasks: {
      where: { status: 'TODO' },
      orderBy: { createdAt: 'asc' },
    },
  },
});
```

### 3.4 Nested Writes

```ts
// Create user + tasks in one query (no extra round-trip)
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    tasks: {
      create: [
        { title: 'Task 1', status: 'TODO' },
        { title: 'Task 2', status: 'TODO' },
      ],
    },
  },
  include: { tasks: true },
});

// Connect existing task to a user (no new record)
await prisma.user.update({
  where: { id: 1 },
  data: { tasks: { connect: { id: 5 } } },
});

// Disconnect (removes FK, does NOT delete the task record)
await prisma.user.update({
  where: { id: 1 },
  data: { tasks: { disconnect: { id: 5 } } },
});
```

---

## 4. Key Patterns for NestJS

### 4.1 async/await in a Service

```ts
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({ data: dto });
  }
}
```

### 4.2 Error Handling

```ts
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

try {
  await this.prisma.task.create({ data: dto });
} catch (e) {
  if (e instanceof PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':   // Unique constraint violated
        throw new ConflictException('Duplicate value on unique field');
      case 'P2025':   // Record not found (update/delete)
        throw new NotFoundException('Record not found');
      case 'P2003':   // Foreign key constraint failed
        throw new BadRequestException('Invalid related record id');
    }
  }
  throw e;  // re-throw unknown errors
}
```

| Code | Trigger |
|---|---|
| `P2002` | `@unique` field already has that value |
| `P2025` | `update` or `delete` where no record matches |
| `P2003` | FK points to a non-existent parent record |

### 4.3 Transactions (`$transaction`)

```ts
// Sequential (each uses the same connection, rollback on failure)
const [user, task] = await this.prisma.$transaction([
  this.prisma.user.create({ data: { email: 'alice@example.com' } }),
  this.prisma.task.create({ data: { title: 'Onboarding', userId: 1, status: 'TODO' } }),
]);

// Interactive transaction — use tx client for full control
await this.prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email: 'bob@example.com' } });
  await tx.task.create({ data: { title: 'Welcome task', userId: user.id, status: 'TODO' } });
  // Any throw here rolls back ALL operations above
});
```

> Use interactive transactions when the second query depends on data from the first.
