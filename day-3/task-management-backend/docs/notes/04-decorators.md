# 4. Common NestJS Decorators

A **decorator** is a function prefixed with `@` that attaches metadata to a class, method, or parameter. NestJS reads that metadata at startup to figure out what to wire where.

You're not "calling" them at runtime — you're labeling code so the framework can act on it.

## Class-level decorators

### `@Module({ … })`
Marks a class as a module and declares its `controllers`, `providers`, `imports`, and `exports`.
```ts
@Module({ controllers: [TasksController], providers: [TasksService] })
export class TasksModule {}
```

### `@Controller('path')`
Marks a class as a controller and sets the **base route** for all its handlers.
```ts
@Controller('tasks')          // every route inside is prefixed with /tasks
export class TasksController {}
```

### `@Injectable()`
Marks a class as something the DI container can manage and inject.
```ts
@Injectable()
export class TasksService {}
```

## Method-level decorators (HTTP verbs)

These map a method to an HTTP route. The string argument is appended to the controller's base path.

| Decorator | Maps to |
|---|---|
| `@Get('path?')` | `GET /tasks/path` |
| `@Post('path?')` | `POST /tasks/path` |
| `@Put('path?')` | `PUT /tasks/path` |
| `@Patch('path?')` | `PATCH /tasks/path` |
| `@Delete('path?')` | `DELETE /tasks/path` |

```ts
@Controller('tasks')
export class TasksController {
  @Get()              // GET /tasks
  findAll() {}

  @Get(':id')         // GET /tasks/:id
  findOne() {}

  @Post()             // POST /tasks
  create() {}
}
```

## Parameter decorators

These pull data **out of the incoming request** and into your method parameters.

### `@Body()`
The parsed JSON body of the request.
```ts
@Post()
create(@Body() dto: CreateTaskDto) { … }
```

### `@Param('name')`
A route parameter (the `:id` part of `/tasks/:id`).
```ts
@Get(':id')
findOne(@Param('id') id: string) { … }
```

### `@Query('name')`
A query string parameter (`?status=open`).
```ts
@Get()
findAll(@Query('status') status?: string) { … }
```

### `@Headers('name')` and `@Req()` / `@Res()`
For headers and the raw request/response objects. Use `@Req`/`@Res` sparingly — they couple your code to Express and bypass Nest's response handling.

## Why decorators instead of config files?
- **Co-location** — the route, the body shape, and the handler all sit together
- **Type safety** — TypeScript checks parameter types at the same time
- **Discoverability** — you read the controller top-to-bottom and see the whole API surface

## Key insight
Decorators are NestJS's main idiom. **Anywhere you see `@Something`, you're declaring intent**, not running logic — Nest reads that intent at startup and builds the app accordingly. Once that clicks, the rest of the framework feels much smaller.
