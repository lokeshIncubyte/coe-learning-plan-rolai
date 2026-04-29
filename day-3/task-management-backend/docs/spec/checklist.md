# Day 3 Checklist — NestJS Introduction & First API

**Project:** Task Management App — backend kickoff
**Reference:** [`requirements.md`](requirements.md), [`nestjs-restful-crud-api.pdf`](../references/nestjs-restful-crud-api.pdf)

---

## 1. Learn — concepts before code
- [x] What NestJS is, and why use it over plain Express → [`01-what-is-nestjs.md`](../notes/01-what-is-nestjs.md)
- [x] NestJS architecture: **modules**, **controllers**, **services** — what each one owns → [`02-architecture.md`](../notes/02-architecture.md)
- [x] Dependency Injection in NestJS — what gets injected, how, and why → [`03-dependency-injection.md`](../notes/03-dependency-injection.md)
- [x] Common decorators: `@Module`, `@Controller`, `@Injectable`, `@Get`, `@Post`, `@Body`, `@Param` → [`04-decorators.md`](../notes/04-decorators.md)
- [x] NestJS project structure and naming conventions (`*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`) → [`05-project-structure.md`](../notes/05-project-structure.md)

## 2. Setup — scaffold the backend
- [x] ~~Install Nest CLI globally~~ — used `npx @nestjs/cli@latest` instead (no global install)
- [x] Create the project: `npx @nestjs/cli@latest new task-management-backend --package-manager npm --skip-git` → lives at `day-3/task-management-backend/`
- [x] Run the dev server (`npm run start:dev`) and confirm `GET /` returns `Hello World!` (HTTP 200)
   - **Port note:** changed `main.ts` to listen on **3001** because port 3000 is already taken by a WSL-relayed Next.js app (Rolai) on this machine

## 3. Build — Tasks API
- [x] Generate the tasks module: `nest g module tasks`
- [x] Generate the controller: `nest g controller tasks`
- [x] Generate the service: `nest g service tasks`
- [x] Define a `Task` model/interface (id, title, description, status)
- [x] Implement `TasksService` with in-memory business logic (`getAll`, `create`)
- [x] Wire `TasksService` into `TasksController` via constructor injection
- [x] `GET /tasks` — return all tasks
- [x] `POST /tasks` — create a new task from request body

## 4. Validate — request validation
- [x] Install `class-validator` and `class-transformer`
- [x] Enable `ValidationPipe` globally in `main.ts`
- [x] Create `CreateTaskDto` with validation decorators (`@IsString`, `@IsNotEmpty`, `@IsOptional`, etc.)
- [x] Verify invalid POST bodies are rejected with a 400 response

## 5. Verify — manual smoke test
- [x] `GET /tasks` returns `[]` initially
- [x] `POST /tasks` with a valid body creates and returns the task
- [x] `POST /tasks` with an invalid body returns a clear validation error
- [x] Subsequent `GET /tasks` reflects the created task

## 6. Ship — push to GitHub
- [x] Add a `README.md` with run instructions
- [x] `.gitignore` excludes `node_modules` and `dist`
- [x] Initial commit with a clean message
- [x] Push the Task Management backend repo to GitHub

---

## Success Criteria (from requirements)
- [x] NestJS project created for Task Management App
- [x] Demonstrates understanding of NestJS architecture
- [x] `TasksController` and `TasksService` implemented
- [x] Dependency injection used correctly
- [x] REST API exposes `GET` and `POST` endpoints
- [x] Request validation in place
- [x] Follows NestJS conventions
- [x] Backend pushed to GitHub
