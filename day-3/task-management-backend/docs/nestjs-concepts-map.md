# NestJS Concepts Map

*Where each framework primitive lives in our `src/`.*

**Abstract notes**: `docs/notes/` · **API**: [api-contract.md](./api-contract.md) · **Architecture**: [architecture.md](./architecture.md)

> This file maps *existing code* to framework concepts. It is not a curriculum — if a concept is not yet in `src/`, it is not listed here. Re-run after each build day.
>
> **Current snapshot**: Day 3 code — `GET /tasks`, `POST /tasks`, validation.

---

## 1. Modules

A module is a class decorated with `@Module()` that groups related controllers and providers into a cohesive unit. Every NestJS application has one root module (`AppModule`) which imports feature modules. Modules are singletons by default — registering `TasksModule` once makes `TasksService` available everywhere that imports `TasksModule`.

**Feature module** — scopes the tasks feature into one folder:

[`src/tasks/tasks.module.ts`](../src/tasks/tasks.module.ts)
```ts
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

**Root module** — the application graph entry point; wires `TasksModule` in:

[`src/app.module.ts`](../src/app.module.ts)
```ts
@Module({
  imports: [TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

> See also: [02-architecture.md](./notes/02-architecture.md), [05-project-structure.md](./notes/05-project-structure.md)

---

## 2. Controllers

A controller handles incoming HTTP requests and returns responses. It owns the route binding and `@Body()`/`@Param()` extraction — nothing else. Business logic lives in the service.

[`src/tasks/tasks.controller.ts`](../src/tasks/tasks.controller.ts)
```ts
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAll();
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto): Task {
    return this.tasksService.create(dto);
  }
}
```

`@Controller('tasks')` sets the base path. `@Get()` and `@Post()` without a sub-path bind to `/tasks`. `@Body()` extracts and deserialises the JSON body into the DTO type.

> See also: [02-architecture.md](./notes/02-architecture.md), [04-decorators.md](./notes/04-decorators.md)

---

## 3. Services (Providers)

A service is a plain TypeScript class decorated with `@Injectable()`. The decorator registers it with Nest's IoC container. Services hold all business logic and in-memory/database state — nothing HTTP-specific lives here.

[`src/tasks/tasks.service.ts`](../src/tasks/tasks.service.ts)
```ts
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  create(dto: { title: string; description: string }): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      status: 'OPEN',
    };
    this.tasks.push(task);
    return task;
  }
}
```

`private tasks: Task[] = []` is the in-memory store. `crypto.randomUUID()` is a Node ≥19 built-in — no extra dependency for ID generation.

> See also: [02-architecture.md](./notes/02-architecture.md), [03-dependency-injection.md](./notes/03-dependency-injection.md)

---

## 4. Dependency Injection

Nest's DI container resolves providers by type. Declaring a typed constructor parameter is all that's needed — the container looks up the registered provider for that type and injects it. The controller never calls `new TasksService()`.

**Constructor injection** — the only pattern used in this project:

[`src/tasks/tasks.controller.ts`](../src/tasks/tasks.controller.ts)
```ts
constructor(private readonly tasksService: TasksService) {}
```

**Provider registration** — the module is the declaration site:

[`src/tasks/tasks.module.ts`](../src/tasks/tasks.module.ts)
```ts
@Module({
  controllers: [TasksController],
  providers: [TasksService],   // ← registers TasksService with the container
})
export class TasksModule {}
```

The `private readonly` shorthand declares and assigns the field in one line — idiomatic NestJS.

> See also: [03-dependency-injection.md](./notes/03-dependency-injection.md)

---

## 5. Decorators

Decorators attach metadata to classes and methods so the framework can wire them at startup. They never run application logic themselves.

| Decorator | Where | Role |
|-----------|-------|------|
| `@Module()` | `*.module.ts` | Declares providers, controllers, imports, exports |
| `@Controller('tasks')` | `tasks.controller.ts` | Sets base route prefix `/tasks` |
| `@Injectable()` | `tasks.service.ts` | Registers class with the IoC container |
| `@Get()` | `tasks.controller.ts` | Binds method to `GET /tasks` |
| `@Post()` | `tasks.controller.ts` | Binds method to `POST /tasks` |
| `@Body()` | `tasks.controller.ts` | Extracts + deserialises request body into DTO |

**All four class-level decorator sites in one view**:

```ts
// app.module.ts
@Module({ imports: [TasksModule], … })    export class AppModule {}

// tasks.module.ts
@Module({ controllers: […], providers: […] }) export class TasksModule {}

// tasks.controller.ts
@Controller('tasks')                      export class TasksController {}

// tasks.service.ts
@Injectable()                             export class TasksService {}
```

> See also: [04-decorators.md](./notes/04-decorators.md)

---

## 6. DTOs + `class-validator`

A DTO (Data Transfer Object) is a class — not an interface — that describes the shape of a request body. It must be a class because `class-validator` decorators attach runtime metadata via TypeScript's `emitDecoratorMetadata`; interfaces are erased at compile time and carry no metadata.

**`CreateTaskDto`** — the only DTO in the codebase today:

[`src/tasks/dto/create-task.dto.ts`](../src/tasks/dto/create-task.dto.ts)
```ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
```

`@IsNotEmpty()` rejects empty strings. `@IsOptional()` lets the field be absent entirely without triggering subsequent validators.

**Global `ValidationPipe`** — intercepts every request before the controller is called:

[`src/main.ts`](../src/main.ts)
```ts
app.useGlobalPipes(new ValidationPipe());
await app.listen(process.env.PORT ?? 3001);
```

A POST body that fails validation never reaches `createTask()` — the pipe throws `BadRequestException` with a structured `400` envelope listing each violated constraint.

> Note: `whitelist` and `transform` are not yet enabled — planned for Day 4.

---

## 7. Domain Types

The `Task` interface and `TaskStatus` type define the domain model used across the feature. Kept separate from the DTO so the entity and the input shape can diverge independently.

[`src/tasks/task.interface.ts`](../src/tasks/task.interface.ts)
```ts
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
```

`TaskStatus` is a string literal union (not a numeric enum) so it serialises to readable JSON. All three values are declared now even though Day 3 only produces `'OPEN'` — status transitions will not require a type change in Day 4.

Note: `import type { Task }` is used in the decorated controller file — required by `isolatedModules: true` + `emitDecoratorMetadata: true` (TypeScript error TS1272).

---

## 8. Testing with `@nestjs/testing`

Three test files use `Test.createTestingModule()` to spin up the DI container in isolation — no real HTTP server, no real database.

**Unit test — service** (direct instantiation via DI):

[`src/tasks/tasks.service.spec.ts`](../src/tasks/tasks.service.spec.ts)
```ts
const module: TestingModule = await Test.createTestingModule({
  providers: [TasksService],
}).compile();
service = module.get<TasksService>(TasksService);
```

**Unit test — controller** (service mocked via `jest.spyOn`):

[`src/tasks/tasks.controller.spec.ts`](../src/tasks/tasks.controller.spec.ts)
```ts
const module: TestingModule = await Test.createTestingModule({
  controllers: [TasksController],
  providers: [TasksService],
}).compile();
controller = module.get<TasksController>(TasksController);
tasksService = module.get<TasksService>(TasksService);
```

**Integration-level validation test** (real HTTP pipe, no external server):

[`src/tasks/tasks.validation.spec.ts`](../src/tasks/tasks.validation.spec.ts)
```ts
app = module.createNestApplication();
app.useGlobalPipes(new ValidationPipe());
await app.init();
const response = await request(app.getHttpServer()).post('/tasks').send({});
expect(response.status).toBe(400);
```

This last pattern is required for testing `ValidationPipe` behaviour — the pipe runs at the HTTP boundary, before any controller method is called, so a pure unit test of the controller method would never observe the `400`.

---

## Success Criteria Cross-check (Day 3)

| Success criterion | Evidence in `src/` |
|-------------------|--------------------|
| NestJS project created for Task Management App | `src/main.ts` bootstraps `AppModule`; project at `day-3/task-management-backend/` |
| Demonstrates understanding of NestJS architecture | `TasksModule` → `TasksController` → `TasksService` three-layer split; each file owns exactly one role |
| `TasksController` and `TasksService` implemented | `src/tasks/tasks.controller.ts` (GET + POST), `src/tasks/tasks.service.ts` (getAll + create) |
| Dependency injection used correctly | `TasksController` constructor receives `TasksService` via DI; no `new TasksService()` anywhere |
| REST API exposes `GET` and `POST` endpoints | `@Get()` → `getAllTasks()`, `@Post()` → `createTask()` in `tasks.controller.ts` |
| Request validation in place | `CreateTaskDto` with `@IsString`/`@IsNotEmpty`/`@IsOptional`; global `ValidationPipe` in `main.ts` |
| Follows NestJS conventions | Feature-folder layout, `*.module/controller/service/dto.ts` suffixes, `@Module` registers all providers |
| Backend pushed to GitHub | Committed and pushed on Day 3 (`git log` confirms); `README.md` includes run instructions |

---

## Changes

| Day | Concepts added |
|-----|---------------|
| Day 3 | Modules, Controllers, Services, DI, Decorators, DTOs + `class-validator`, Testing |
| Day 4 | `UpdateTaskDto` + `PartialType`, `TaskStatsService` (service-to-service DI), `NotFoundException`, `ValidationPipe { whitelist, transform }`, `@Param`, `@Delete`, `@Patch`, `@HttpCode` *(planned)* |
