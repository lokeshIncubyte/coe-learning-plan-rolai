import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import request from 'supertest';
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

  // 10G — a token signed with the wrong secret must be rejected
  it('returns 401 for a token signed with the wrong secret', async () => {
    const forged = new JwtService({ secret: 'wrong-secret' }).sign({
      sub: '1',
      email: 'alice@example.com',
    });

    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${forged}`)
      .send({ title: 'Buy milk', description: '' })
      .expect(401);
    expect(mockPrisma.task.create).not.toHaveBeenCalled();
  });

  // 10G — an expired token must be rejected (ignoreExpiration: false)
  it('returns 401 for an expired token', async () => {
    const expired = jwt.sign(
      { sub: '1', email: 'alice@example.com' },
      { expiresIn: '-1s' },
    );

    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${expired}`)
      .send({ title: 'Buy milk', description: '' })
      .expect(401);
    expect(mockPrisma.task.create).not.toHaveBeenCalled();
  });
});
