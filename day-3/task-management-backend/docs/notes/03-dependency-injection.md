# 3. Dependency Injection in NestJS

## What DI actually is
Dependency Injection is a fancy name for a simple idea:

> *Don't `new` your dependencies — ask for them, and let someone else hand them over.*

Without DI:
```ts
class TasksController {
  private service = new TasksService();   // controller picks its own service
}
```

With DI:
```ts
class TasksController {
  constructor(private service: TasksService) {}   // someone hands it in
}
```

The "someone" is Nest's **DI container** (also called the IoC — Inversion of Control — container). It owns the lifecycle of providers and wires them into whoever asks.

## Why bother?
1. **Testing** — In a unit test you pass in a fake/mock service. No need to monkey-patch or stub modules.
2. **Decoupling** — The controller doesn't care *how* the service is constructed, just that it satisfies the type.
3. **Single instance by default** — Nest creates one `TasksService` and reuses it. You don't create five copies by accident.
4. **Swappability** — Switch `TasksService` for `RemoteTasksService` in one place (the module), and every consumer picks it up.

## The three steps in NestJS

### Step 1 — mark the class as injectable
```ts
@Injectable()
export class TasksService { … }
```
The `@Injectable()` decorator tells Nest *"this class can be managed by the DI container."*

### Step 2 — register it as a provider
```ts
@Module({
  providers: [TasksService],
})
export class TasksModule {}
```
Now the module knows this service exists and can hand it out.

### Step 3 — ask for it via the constructor
```ts
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
}
```
Nest sees the parameter type, looks it up in the container, and injects the instance.

## What gets injected
- Services (the common case)
- Repositories (when using TypeORM/Prisma modules)
- Configuration objects
- Other modules' exported providers
- Custom providers (factories, values, async providers)

## Provider scope (good to know, not day-3 essential)
- **Singleton** (default) — one instance for the whole app
- **Request-scoped** — new instance per request (rarely needed)
- **Transient** — new instance every time it's injected

Stick with singleton until you have a concrete reason not to.

## Key insight
DI is the **glue that makes the module/controller/service split actually work**. Without DI, the controller would have to know how to build its own service — and the moment that service needs a database, a logger, and a config, the controller becomes responsible for assembling all of it. DI moves that responsibility into the framework, where it belongs.
