---
id: cycle-001
slug: task-model-schema
status: done
source: "§4 Define Task model in prisma/schema.prisma"
covers: happy-path
---

## Behavior
After adding the `Task` model and `TaskStatus` enum to `schema.prisma` and running `prisma generate`, the generated Prisma client exposes a `task` model accessor and a typed `TaskStatus` enum with values `OPEN`, `IN_PROGRESS`, and `DONE`.

## RED
- **Test file**: `src/prisma/prisma-schema.spec.ts`
- **Assertion**:
  ```ts
  import { PrismaClient, TaskStatus } from '../../generated/prisma';

  it('PrismaClient exposes task model accessor', () => {
    const prisma = new PrismaClient();
    expect(prisma.task).toBeDefined();
  });

  it('TaskStatus enum has all three values', () => {
    expect(TaskStatus.OPEN).toBe('OPEN');
    expect(TaskStatus.IN_PROGRESS).toBe('IN_PROGRESS');
    expect(TaskStatus.DONE).toBe('DONE');
  });
  ```
- **Why it fails**: `generated/prisma` does not exist — `prisma generate` has not been run with a Task model in the schema, so the import throws `Cannot find module`.

## GREEN
- **Smallest change**: Add `Task` model (6 fields) + `TaskStatus` enum to `prisma/schema.prisma`, then run `npx prisma generate` to emit the typed client into `generated/prisma`.
- **Files touched**: `prisma/schema.prisma`

## REFACTOR
none
