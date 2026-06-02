import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatsService } from './tasks.stats.service';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        TaskStatsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('rejects a body with no title — expects 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({});
    expect(response.status).toBe(400);
  });

  it('rejects a body with empty title — expects 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: '', description: 'desc' });
    expect(response.status).toBe(400);
  });

  it('rejects an invalid status value — expects 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
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
