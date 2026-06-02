import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import request = require('supertest');
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatsService } from './tasks.stats.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

const mockPrisma = { task: { create: jest.fn().mockResolvedValue({}) } };

describe('POST /tasks — validation', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';
    const module: TestingModule = await Test.createTestingModule({
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

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const jwt = module.get<JwtService>(JwtService);
    token = jwt.sign({ sub: '1', email: 'alice@example.com' });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejects a body with no title — expects 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(response.status).toBe(400);
  });

  it('rejects a body with empty title — expects 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', description: 'desc' });
    expect(response.status).toBe(400);
  });

  it('rejects an invalid status value — expects 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'T', status: 'FLYING' });
    expect(response.status).toBe(400);
  });
});

describe('PaginationDto — validation', () => {
  it('PaginationDto rejects a non-integer page', async () => {
    const dto = plainToInstance(PaginationDto, { page: 'abc' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
