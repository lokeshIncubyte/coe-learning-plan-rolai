import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { TasksModule } from './tasks.module';

describe('POST /tasks — validation', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
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
});
