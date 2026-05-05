import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Tasks API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /tasks/:id returns 200 and task for valid id', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Test Task', description: 'A description' })
      .expect(201);

    const id = createRes.body.id;

    const getRes = await request(app.getHttpServer())
      .get(`/tasks/${id}`)
      .expect(200);

    expect(getRes.body).toMatchObject({
      id,
      title: 'Test Task',
      description: 'A description',
      status: 'OPEN',
    });
  });
});
