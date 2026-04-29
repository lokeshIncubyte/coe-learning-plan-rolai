# 5. NestJS Project Structure & Conventions

## What `nest new <name>` gives you

```
task-management-backend/
├── src/
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── eslint.config.mjs
```

### Key files
- **`main.ts`** — the entry point. Bootstraps the Nest app with `NestFactory.create(AppModule)` and starts the HTTP listener.
- **`app.module.ts`** — the root module. Everything else hangs off this.
- **`app.controller.ts` / `app.service.ts`** — sample controller + service. Safe to delete once you have your own.
- **`*.spec.ts`** — co-located unit tests (Jest).
- **`test/*.e2e-spec.ts`** — end-to-end tests that boot the whole app.

## Naming conventions

NestJS expects a consistent **kebab-case filename + dotted role suffix**:

| File | Contains |
|---|---|
| `tasks.module.ts` | `TasksModule` class |
| `tasks.controller.ts` | `TasksController` class |
| `tasks.service.ts` | `TasksService` class |
| `tasks.controller.spec.ts` | Unit tests for the controller |
| `dto/create-task.dto.ts` | `CreateTaskDto` (request shape) |
| `dto/update-task.dto.ts` | `UpdateTaskDto` |
| `entities/task.entity.ts` | `Task` (domain model / DB entity) |
| `interfaces/task.interface.ts` | `Task` interface (when not using a class) |

Class names are **PascalCase**, filenames are **kebab-case**. The role suffix (`.module`, `.controller`, `.service`, `.dto`, `.entity`, `.spec`) is non-negotiable — the CLI and tooling rely on it.

## The feature-folder pattern

As soon as you have more than one feature, group by **feature**, not by file type:

```
src/
├── app.module.ts
├── main.ts
└── tasks/
    ├── tasks.module.ts
    ├── tasks.controller.ts
    ├── tasks.service.ts
    ├── tasks.controller.spec.ts
    ├── dto/
    │   ├── create-task.dto.ts
    │   └── update-task.dto.ts
    └── entities/
        └── task.entity.ts
```

Don't do this:
```
src/
├── controllers/        ← ❌ groups by type, scatters features
├── services/
└── dtos/
```

When you change a feature, you want everything for that feature in **one folder**.

## Use the CLI — don't hand-roll

The Nest CLI both **creates the file** and **registers it** in the right module. Manual file creation means you'll forget the registration step.

```bash
nest g module tasks
nest g controller tasks
nest g service tasks
```

After running these, check `tasks.module.ts` — the controller and service are already wired into `controllers: []` and `providers: []`.

## What goes where — quick rules

| Putting this in… | Goes in |
|---|---|
| Route handlers | Controller |
| Business logic | Service |
| Request body shape + validation | DTO |
| Domain model (or DB row) | Entity |
| Cross-feature reusable code | A separate `shared/` or `common/` module |
| Bootstrap (`ValidationPipe`, CORS, port) | `main.ts` |

## Key insight
NestJS conventions exist so a developer new to the project can **find any piece of code in under 30 seconds**. Follow the suffix pattern, group by feature, and let the CLI do the wiring — fighting these conventions costs more than it saves.
