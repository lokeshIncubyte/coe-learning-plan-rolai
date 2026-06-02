---
id: cycle-022
slug: pagination-dto-validation
status: done
source: "Create PaginationDto with @IsOptional, @IsInt, @Min(1) validation"
covers: validation
group: pagination-get-tasks
---

## Behavior
`PaginationDto` exists at `src/tasks/dto/pagination.dto.ts`. It exposes `page` and `limit` as optional integers (≥ 1) with class-level defaults of 1 and 10. When a non-integer string is supplied for `page`, class-validator `validate()` returns at least one error.

## RED
- **Test file**: `src/tasks/tasks.validation.spec.ts`
- **Assertion**:
  ```ts
  import { plainToInstance } from 'class-transformer';
  import { validate } from 'class-validator';
  import { PaginationDto } from './dto/pagination.dto';

  it('PaginationDto rejects a non-integer page', async () => {
    const dto = plainToInstance(PaginationDto, { page: 'abc' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
  ```
- **Why it fails**: `src/tasks/dto/pagination.dto.ts` does not exist; import throws `MODULE_NOT_FOUND`.

## GREEN
- **Smallest change**: Create `src/tasks/dto/pagination.dto.ts` with `page` and `limit` fields annotated with `@IsOptional()`, `@IsInt()`, `@Min(1)`, and `@Type(() => Number)` (class-transformer coercion). Assign class-level defaults: `page = 1`, `limit = 10`.
- **Files touched**:
  - `src/tasks/dto/pagination.dto.ts` (new)
  - `src/tasks/tasks.validation.spec.ts` (new — add the describe block for PaginationDto)

## REFACTOR
none

---
---
id: cycle-023
slug: tasks-service-getall-pagination
status: done
source: "Apply skip = (page - 1) * limit, take = limit in findMany; return { data, total, page, limit }"
covers: happy-path
group: pagination-get-tasks
---

## Behavior
`TasksService.getAll(pagination: PaginationDto)` calls `prisma.task.findMany` with `{ skip: (page-1)*limit, take: limit }` and `prisma.task.count()` (no args), then returns `{ data: Task[], total: number, page: number, limit: number }`.

## RED
- **Test file**: `src/tasks/tasks.service.spec.ts`
- **Assertion**:
  ```ts
  it('getAll(pagination) applies skip/take and returns paginated shape', async () => {
    const rows = [{ id: '1', title: 'T', description: '', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() }];
    jest.spyOn(mockPrisma.task, 'findMany').mockResolvedValue(rows as any);
    jest.spyOn(mockPrisma.task, 'count').mockResolvedValue(42);

    const result = await service.getAll({ page: 2, limit: 5 } as any);

    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({ skip: 5, take: 5 });
    expect(result).toStrictEqual({ data: rows, total: 42, page: 2, limit: 5 });
  });
  ```
- **Why it fails**: `getAll()` accepts no args, calls `findMany()` with no arguments, and returns `Task[]` — both the `findMany` call assertion and the shape assertion fail.

## GREEN
- **Smallest change**: Update `getAll()` signature to `async getAll(pagination: PaginationDto): Promise<{ data: Task[]; total: number; page: number; limit: number }>`. Compute `skip = (pagination.page - 1) * pagination.limit`; call `findMany({ skip, take: pagination.limit })` and `count()`; return the object.
- **Files touched**: `src/tasks/tasks.service.ts`

**Update existing test** (required — prevents breakage, not new scope):
In `tasks.service.spec.ts`, update `'getAll() delegates to prisma.task.findMany()'` to pass `{ page: 1, limit: 10 }` and assert the new paginated return shape `{ data: rows, total: N, page: 1, limit: 10 }`. Also mock `mockPrisma.task.count` in that test.
- **Additional file touched**: `src/tasks/tasks.service.spec.ts` (update existing test only)

## REFACTOR
none

---
---
id: cycle-024
slug: tasks-controller-getall-pagination
status: done
source: "Update controller to accept @Query() pagination: PaginationDto"
covers: happy-path
group: pagination-get-tasks
---

## Behavior
`TasksController.getAllTasks(@Query() pagination: PaginationDto)` passes the pagination DTO directly to `TasksService.getAll(pagination)` and returns its result.

## RED
- **Test file**: `src/tasks/tasks.controller.spec.ts`
- **Assertion**:
  ```ts
  it('getAllTasks() passes pagination query to TasksService.getAll()', async () => {
    const paginated = { data: [mockTask], total: 1, page: 1, limit: 10 };
    jest.spyOn(tasksService, 'getAll').mockResolvedValue(paginated as any);
    const dto = { page: 1, limit: 10 } as any;

    const result = await controller.getAllTasks(dto);

    expect(tasksService.getAll).toHaveBeenCalledWith(dto);
    expect(result).toStrictEqual(paginated);
  });
  ```
- **Why it fails**: `getAllTasks()` accepts no params and calls `tasksService.getAll()` with no arguments — `toHaveBeenCalledWith(dto)` fails.

## GREEN
- **Smallest change**: Add `@Query() pagination: PaginationDto` param to `getAllTasks()` in `TasksController`; pass it to `this.tasksService.getAll(pagination)`.
- **Files touched**: `src/tasks/tasks.controller.ts`

**Update existing test** (required — prevents TypeScript compile error):
In `tasks.controller.spec.ts`, update `'getAllTasks() awaits TasksService.getAll()'` to pass a pagination object (`{ page: 1, limit: 10 }`) and mock `getAll` to return a paginated shape.
- **Additional file touched**: `src/tasks/tasks.controller.spec.ts` (update existing test only)

## REFACTOR
none
