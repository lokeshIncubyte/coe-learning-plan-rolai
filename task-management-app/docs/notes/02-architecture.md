# 2. NestJS Architecture — Modules, Controllers, Services

NestJS apps are built from three primary building blocks. Each has **one job**, and keeping them separate is the whole point.

## The three roles

### Module — *the organizer*
A module groups related pieces of the app into one cohesive unit. Every Nest app has at least one module: `AppModule` (the root). As the app grows, you split features into their own modules — e.g., `TasksModule`, `UsersModule`, `AuthModule`.

A module declares:
- **`controllers`** — which controllers belong to it
- **`providers`** — which services (and other injectables) live in it
- **`imports`** — which other modules it depends on
- **`exports`** — which providers it makes available to other modules

```ts
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

### Controller — *the doorway*
Controllers handle **incoming HTTP requests** and return responses. That's it. They should be thin: parse the request, hand off to a service, return the result.

```ts
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}
```

A controller should **not** contain business logic, talk to the database, or call external APIs directly. Those belong in services.

### Service — *the brain*
Services hold the **business logic** — the actual rules and operations of your app. They're decorated with `@Injectable()` so Nest's DI container can hand them out wherever needed.

```ts
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll() {
    return this.tasks;
  }

  create(dto: CreateTaskDto) {
    const task = { id: uuid(), ...dto };
    this.tasks.push(task);
    return task;
  }
}
```

## The mental model

```
HTTP request
     ↓
[ Controller ]   ← parses request, validates shape
     ↓
[ Service    ]   ← business logic, data manipulation
     ↓
[ Repository / DB ]   ← (added later when you wire a database)
```

## Why this separation matters
- **Testability** — you can unit-test the service without spinning up HTTP
- **Reusability** — multiple controllers (REST, GraphQL, CLI) can share one service
- **Clarity** — when a bug appears, you know where to look

## Key insight
The split is not academic. It's the same instinct as MVC: **don't let the thing that talks to the network also know about the database**. Controllers are translators between HTTP and your domain; services *are* your domain.
