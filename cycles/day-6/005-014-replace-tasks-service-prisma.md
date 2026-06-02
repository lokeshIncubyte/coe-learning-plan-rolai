---
group: replace-tasks-service-prisma
status: pending
source: "day-6 checklist §2 — Replace in-memory TasksService with Prisma"
---

<!-- Shared setup — add to top of tasks.service.spec.ts in cycle-005 GREEN, reuse through cycle-012 -->
<!--
const mockPrisma = {
  task: {
    create:     jest.fn(),
    findMany:   jest.fn(),
    findUnique: jest.fn(),
    update:     jest.fn(),
    delete:     jest.fn(),
    count:      jest.fn(),
  },
};

const p2025 = Object.assign(new Error('Record not found'), {
  code: 'P2025',
  name: 'PrismaClientKnownRequestError',
});
-->

> **⚠ Test-suite note**: From cycle-005 GREEN onward, `tasks.controller.spec.ts` will
> fail to compile because it provides the real `TasksService`, which now requires
> `PrismaService`. Run tests with `--testPathPattern tasks.service` until cycle-014
> is complete. Do not run a bare `npm test` between cycles 005 and 014.

---

## cycle-005 — tasks-service-create-async

```
id: cycle-005
slug: tasks-service-create-async
covers: happy-path
prerequisite: none
status: done
```

### Behavior
`TasksService` accepts a `PrismaService` in its constructor. `create()` is async and delegates to `prisma.task.create()`, returning the Prisma `Task` record. The in-memory array is gone.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('create() delegates to prisma.task.create()', async () => {
    const dto = { title: 'T', description: 'D' };
    const stored = { id: '1', title: 'T', description: 'D', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(mockPrisma.task, 'create').mockResolvedValue(stored as any);

    const result = await service.create(dto);

    expect(mockPrisma.task.create).toHaveBeenCalledWith({ data: { title: 'T', description: 'D' } });
    expect(result).toStrictEqual(stored);
  });
  ```
- **Why it fails**: `create()` never calls `prisma.task.create`; it pushes to an in-memory array and returns a locally constructed object.

### GREEN
- **Smallest change**:
  1. Add `constructor(private readonly prisma: PrismaService)` to `TasksService`.
  2. Rewrite `create()` as `async create(dto) { return this.prisma.task.create({ data: { title: dto.title, description: dto.description } }); }`.
  3. Update `tasks.service.spec.ts` `beforeEach` to add `{ provide: PrismaService, useValue: mockPrisma }` and add `await` to all existing `create()` call sites in the spec.
- **Files touched**: `src/tasks/tasks.service.ts`, `src/tasks/tasks.service.spec.ts`

### REFACTOR
Remove `private tasks: Task[] = []` array field; it is no longer used after this cycle.

---

## cycle-006 — tasks-service-getall-async

```
id: cycle-006
slug: tasks-service-getall-async
covers: happy-path
prerequisite: cycle-005
status: done
```

### Behavior
`getAll()` is async and returns whatever `prisma.task.findMany()` resolves with. No in-memory array involved.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('getAll() delegates to prisma.task.findMany()', async () => {
    const rows = [{ id: '1', title: 'T', description: '', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() }];
    jest.spyOn(mockPrisma.task, 'findMany').mockResolvedValue(rows as any);

    const result = await service.getAll();

    expect(mockPrisma.task.findMany).toHaveBeenCalled();
    expect(result).toStrictEqual(rows);
  });
  ```
- **Why it fails**: `getAll()` returns `this.tasks` (in-memory array); `prisma.task.findMany` is never called.

### GREEN
- **Smallest change**: Rewrite `getAll()` as `async getAll() { return this.prisma.task.findMany(); }`.
- **Files touched**: `src/tasks/tasks.service.ts`, `src/tasks/tasks.service.spec.ts` (add `await` to existing `getAll()` assertions)

### REFACTOR
None.

---

## cycle-007 — tasks-service-getbyid-happy

```
id: cycle-007
slug: tasks-service-getbyid-happy
covers: happy-path
prerequisite: cycle-006
status: done
```

### Behavior
`getById()` is async and calls `prisma.task.findUnique({ where: { id } })`, returning the resolved record. Null check is deferred to cycle-008.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('getById() delegates to prisma.task.findUnique()', async () => {
    const row = { id: '1', title: 'T', description: '', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(mockPrisma.task, 'findUnique').mockResolvedValue(row as any);

    const result = await service.getById('1');

    expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toStrictEqual(row);
  });
  ```
- **Why it fails**: `getById()` uses `this.tasks.find()`; `prisma.task.findUnique` is never called.

### GREEN
- **Smallest change**: Rewrite `getById()` as:
  ```ts
  async getById(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }
  ```
  No null check yet — that is cycle-008's job.
- **Files touched**: `src/tasks/tasks.service.ts`, `src/tasks/tasks.service.spec.ts` (add `await` to existing `getById()` happy-path assertion)

### REFACTOR
None.

---

## cycle-008 — tasks-service-getbyid-notfound

```
id: cycle-008
slug: tasks-service-getbyid-notfound
covers: error-path
prerequisite: cycle-007
```

> **Prerequisite**: cycle-007 must be applied first. Before cycle-007, `getById()` uses
> the in-memory array and throws `NotFoundException` for any unknown ID regardless — the
> RED assertion would pass for the wrong reason.

### Behavior
When `prisma.task.findUnique()` resolves to `null`, `getById()` throws `NotFoundException`.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('getById() throws NotFoundException when findUnique returns null', async () => {
    jest.spyOn(mockPrisma.task, 'findUnique').mockResolvedValue(null);

    await expect(service.getById('no-such-id')).rejects.toThrow(NotFoundException);
  });
  ```
- **Why it fails**: After cycle-007, `getById()` returns `null` directly without throwing when `findUnique` resolves to `null`.

### GREEN
- **Smallest change**: After the `findUnique` call, add `if (!task) throw new NotFoundException(\`Task #\${id} not found\`);`.
- **Files touched**: `src/tasks/tasks.service.ts`

### REFACTOR
None.

---

## cycle-009 — tasks-service-update-happy

```
id: cycle-009
slug: tasks-service-update-happy
covers: happy-path
prerequisite: cycle-008
status: done
```

> **Broken-test window**: The existing spec test `'update() throws NotFoundException when
> task does not exist'` currently passes via the in-memory path (`getById()` throws).
> After this cycle's GREEN, `update()` calls `prisma.task.update` directly — that mock
> returns `undefined` by default and will not throw, breaking the existing test.
> This is intentional: cycle-010 replaces it with the correct P2025 assertion.
> Delete the old test in this cycle's GREEN step.

### Behavior
`update()` is async and delegates to `prisma.task.update()` with the correct `where` and `data` arguments, returning the updated record.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('update() delegates to prisma.task.update()', async () => {
    const row = { id: '1', title: 'New', description: '', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(mockPrisma.task, 'update').mockResolvedValue(row as any);

    const result = await service.update('1', { title: 'New' });

    expect(mockPrisma.task.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { title: 'New' } });
    expect(result).toStrictEqual(row);
  });
  ```
- **Why it fails**: `update()` calls `getById()` then `Object.assign`; `prisma.task.update` is never called.

### GREEN
- **Smallest change**:
  1. Rewrite `update()` as `async update(id, dto) { return this.prisma.task.update({ where: { id }, data: dto }); }`.
  2. Delete the existing `'update() throws NotFoundException when task does not exist'` test — it is superseded by cycle-010.
  3. Add `await` to the remaining existing `update()` assertions.
- **Files touched**: `src/tasks/tasks.service.ts`, `src/tasks/tasks.service.spec.ts`

### REFACTOR
None.

---

## cycle-010 — tasks-service-update-notfound

```
id: cycle-010
slug: tasks-service-update-notfound
covers: error-path
prerequisite: cycle-009
status: done
```

### Behavior
When `prisma.task.update()` throws a `P2025` error, `update()` re-throws a `NotFoundException`.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('update() throws NotFoundException on P2025', async () => {
    jest.spyOn(mockPrisma.task, 'update').mockRejectedValue(p2025);

    await expect(service.update('ghost', { title: 'X' })).rejects.toThrow(NotFoundException);
  });
  ```
- **Why it fails**: After cycle-009, `update()` lets the raw Prisma error propagate; no `P2025` catch exists.

### GREEN
- **Smallest change**: Wrap the `prisma.task.update` call in try/catch; if `(e as any).code === 'P2025'` throw `new NotFoundException(...)`, otherwise rethrow.
- **Files touched**: `src/tasks/tasks.service.ts`

### REFACTOR
Extract a `private rethrowNotFound(e: unknown, id: string): never` helper — the same try/catch pattern will be needed in `remove()`.

---

## cycle-011 — tasks-service-remove-happy

```
id: cycle-011
slug: tasks-service-remove-happy
covers: happy-path
prerequisite: cycle-010
status: done
```

> **Broken-test window**: The existing spec test `'remove() throws NotFoundException when
> task does not exist'` currently passes via the in-memory path (`getById()` throws).
> After this cycle's GREEN, `remove()` calls `prisma.task.delete` directly — the mock
> returns `{}` by default and will not throw, breaking the existing test.
> Delete the old test in this cycle's GREEN step; cycle-012 replaces it.

### Behavior
`remove()` is async and calls `prisma.task.delete({ where: { id } })`. Returns `void`.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('remove() delegates to prisma.task.delete()', async () => {
    jest.spyOn(mockPrisma.task, 'delete').mockResolvedValue({} as any);

    await service.remove('1');

    expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
  ```
- **Why it fails**: `remove()` calls `getById()` then filters the in-memory array; `prisma.task.delete` is never called.

### GREEN
- **Smallest change**:
  1. Rewrite `remove()` as `async remove(id: string) { await this.prisma.task.delete({ where: { id } }); }`.
  2. Delete the existing `'remove() throws NotFoundException when task does not exist'` test — superseded by cycle-012.
  3. Add `await` to the remaining existing `remove()` assertion.
- **Files touched**: `src/tasks/tasks.service.ts`, `src/tasks/tasks.service.spec.ts`

### REFACTOR
None.

---

## cycle-012 — tasks-service-remove-notfound

```
id: cycle-012
slug: tasks-service-remove-notfound
covers: error-path
prerequisite: cycle-011
status: done
```

### Behavior
When `prisma.task.delete()` throws `P2025`, `remove()` re-throws `NotFoundException`.

### RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('remove() throws NotFoundException on P2025', async () => {
    jest.spyOn(mockPrisma.task, 'delete').mockRejectedValue(p2025);

    await expect(service.remove('ghost')).rejects.toThrow(NotFoundException);
  });
  ```
- **Why it fails**: After cycle-011, `remove()` lets the raw Prisma error propagate; no `P2025` catch exists.

### GREEN
- **Smallest change**: Wrap `prisma.task.delete` in try/catch; if `(e as any).code === 'P2025'` throw `new NotFoundException(...)`. Use the `rethrowNotFound` helper from cycle-010 refactor if extracted.
- **Files touched**: `src/tasks/tasks.service.ts`

### REFACTOR
None.

---

## cycle-013 — tasks-stats-service-async

```
id: cycle-013
slug: tasks-stats-service-async
covers: happy-path
prerequisite: cycle-012
status: done
```

### Behavior
`TaskStatsService` injects `PrismaService` directly (drops `TasksService` dependency). `getStats()` is async and uses `prisma.task.count()` twice — once for total, once with `where: { status: 'OPEN' }` for open count.

### RED
- **Test file**: `src/tasks/tasks.stats.service.spec.ts`
- **Assertion**:
  ```ts
  it('getStats() calls prisma.task.count() for total and open', async () => {
    jest.spyOn(mockPrisma.task, 'count')
      .mockResolvedValueOnce(5)   // total
      .mockResolvedValueOnce(3);  // open

    const result = await statsService.getStats();

    expect(mockPrisma.task.count).toHaveBeenCalledTimes(2);
    expect(mockPrisma.task.count).toHaveBeenCalledWith({ where: { status: 'OPEN' } });
    expect(result).toStrictEqual({ total: 5, open: 3 });
  });
  ```
- **Why it fails**: `getStats()` calls `this.tasksService.getAll()` and derives counts in memory; `prisma.task.count` is never called.

### GREEN
- **Smallest change**:
  1. Replace `TasksService` injection with `PrismaService` in `TaskStatsService` constructor.
  2. Rewrite `getStats()` with sequential awaits (minimal):
     ```ts
     async getStats() {
       const total = await this.prisma.task.count();
       const open  = await this.prisma.task.count({ where: { status: 'OPEN' } });
       return { total, open };
     }
     ```
  3. Update spec `beforeEach` to provide `{ provide: PrismaService, useValue: mockPrisma }` instead of `TasksService`.
- **Files touched**: `src/tasks/tasks.stats.service.ts`, `src/tasks/tasks.stats.service.spec.ts`

### REFACTOR
- Replace the two sequential `await` calls with `Promise.all` for concurrent execution.
- Remove `task.interface.ts` import from the stats spec; import `TaskStatus` from the generated Prisma client if needed.

---

## cycle-014 — tasks-controller-async

```
id: cycle-014
slug: tasks-controller-async
covers: happy-path
prerequisite: cycle-005
status: done
```

> **Must be applied before running a bare `npm test`**. From cycle-005 GREEN onward,
> `tasks.controller.spec.ts` fails to compile because it provides the real `TasksService`
> which now requires `PrismaService`. Run `npx jest --testPathPattern tasks.service`
> in the interim. cycle-014 can be executed independently of cycles 006–013 — it only
> depends on cycle-005 having added the `PrismaService` constructor to `TasksService`.

### Behavior
All `TasksController` methods are async and `await` the service call. The controller spec replaces the real `TasksService` with a full value mock (no DI chain to `PrismaService`) and uses `mockResolvedValue` / `await` throughout.

### RED
- **Test file**: `src/tasks/tasks.controller.spec.ts`
- **Assertion**:
  ```ts
  it('getAllTasks() awaits TasksService.getAll()', async () => {
    jest.spyOn(tasksService, 'getAll').mockResolvedValue([mockTask] as any);

    const result = await controller.getAllTasks();

    expect(result).toStrictEqual([mockTask]);
  });
  ```
- **Why it fails**: `getAllTasks()` is not async; it returns `this.tasksService.getAll()` synchronously, so `mockResolvedValue` causes the result to be a Promise object rather than the resolved array.

### GREEN
- **Smallest change**:
  1. In `tasks.controller.spec.ts`, replace `providers: [TasksService, ...]` with a full value mock:
     ```ts
     { provide: TasksService, useValue: { getAll: jest.fn(), create: jest.fn(), getById: jest.fn(), update: jest.fn(), remove: jest.fn() } }
     ```
  2. Change every `mockReturnValue` → `mockResolvedValue` (or `mockResolvedValue(undefined)` for `remove`) and every `expect(controller.X())` → `await controller.X()`.
  3. Make every controller method `async` and add `await` before the service call.
- **Files touched**: `src/tasks/tasks.controller.ts`, `src/tasks/tasks.controller.spec.ts`

### REFACTOR
Remove `import type { Task } from './task.interface'` from controller and spec; rely on inferred return types or import `Task` from `../../generated/prisma/client`. Once `task.interface.ts` is unused everywhere, delete it.
