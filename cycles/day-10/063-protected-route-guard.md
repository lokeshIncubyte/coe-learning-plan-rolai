---
id: cycle-063
slug: protected-route-guard
status: done
source: "Day 10 user stories E/F (protected mutation: 401 without token, succeeds with valid token) / checklist §3 protect task routes"
covers: happy-path, error-path
---
## Behavior
The task mutation `POST /tasks` is protected by `JwtAuthGuard`. An HTTP request with **no** `Authorization` header returns **401**; a request carrying a valid `Bearer <token>` (signed by the same `JwtService`/secret the strategy verifies with) passes the guard and returns **201**. Verified end-to-end via supertest against a Nest app built by `@nestjs/testing`, with `PrismaService` mocked (no real DB).

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/protected-route.e2e-spec.ts
- Build the app from `TasksModule` + the auth pieces, override `PrismaService` with a mock, and sign a real token with `JwtService` so the strategy can verify it. Apply the same `ValidationPipe` as `main.ts`.
- Assertion:
```ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as request from 'supertest';
import { TasksController } from '../tasks/tasks.controller';
import { TasksService } from '../tasks/tasks.service';
import { TaskStatsService } from '../tasks/tasks.stats.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

const mockPrisma = {
  task: { create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
};

describe('Protected POST /tasks (e2e)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({ secret: 'test-secret', signOptions: { expiresIn: '1h' } }),
      ],
      controllers: [TasksController],
      providers: [
        TasksService,
        TaskStatsService,
        JwtStrategy,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    jwt = moduleRef.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  // cycle-063 RED
  it('returns 401 without a Bearer token', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Buy milk', description: '' })
      .expect(401);
    expect(mockPrisma.task.create).not.toHaveBeenCalled();
  });

  // cycle-063 RED
  it('returns 201 with a valid Bearer token', async () => {
    const created = { id: '1', title: 'Buy milk', description: '', status: 'OPEN' };
    mockPrisma.task.create.mockResolvedValue(created);
    const token = jwt.sign({ sub: '1', email: 'alice@example.com' });

    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Buy milk', description: '' })
      .expect(201);

    expect(res.body).toMatchObject({ id: '1', title: 'Buy milk' });
    expect(mockPrisma.task.create).toHaveBeenCalled();
  });
});
```
- Why it fails: `TasksController.createTask` is not yet guarded — without `@UseGuards(JwtAuthGuard)` the no-token request returns 201 (not 401), so the first assertion fails.

## GREEN
- Add `@UseGuards(JwtAuthGuard)` to `TasksController.createTask` (apply to other mutations PATCH/DELETE in their own follow-ups, or controller-wide per story F — but this cycle only needs POST guarded to go green; keep the change minimal to POST).
- Import `JwtAuthGuard` into `tasks.controller.ts`.
- Ensure `AuthModule` (exporting `JwtModule`/`PassportModule`/`JwtStrategy`) is wired so the guard resolves at app runtime; `TasksModule` imports `AuthModule` (or `AuthModule` is global). The e2e spec wires providers directly, so production wiring is verified by the app booting in cycle-060/062.
- Files touched: src/tasks/tasks.controller.ts, src/tasks/tasks.module.ts (import AuthModule)

## REFACTOR
If POST/PATCH/DELETE all need guarding (story F), consider `@UseGuards(JwtAuthGuard)` at the controller class level plus a public decorator for any open GET, rather than per-method — defer the broader rollout to a follow-up cycle to keep this one green and minimal.
