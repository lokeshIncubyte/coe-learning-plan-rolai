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

  it('GET /tasks/stats returns 200 with total and open counts', async () => {
    // Create two OPEN tasks and one DONE task
    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Task 1', description: 'desc' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Task 2', description: 'desc' })
      .expect(201);

    const doneTask = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Task 3', description: 'desc', status: 'DONE' })
      .expect(201);

    expect(doneTask.body.status).toBe('DONE');

    const statsRes = await request(app.getHttpServer())
      .get('/tasks/stats')
      .expect(200);

    expect(statsRes.body).toEqual({ total: 3, open: 2 });
  });

  it('POST /tasks with extra unknown field returns 201 and strips unknown field', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Task with extra', description: 'desc', unknownField: 'should be stripped' })
      .expect(201);

    expect(res.body).not.toHaveProperty('unknownField');
    expect(res.body).toMatchObject({
      title: 'Task with extra',
      description: 'desc',
      status: 'OPEN',
    });
  });

  it('DELETE /tasks/:id returns 404 for unknown id', async () => {
    await request(app.getHttpServer())
      .delete('/tasks/nonexistent-id')
      .expect(404);
  });

  it('DELETE /tasks/:id returns 204 with no body for valid id', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Task to delete', description: 'Will be deleted' })
      .expect(201);

    const id = createRes.body.id;

    const deleteRes = await request(app.getHttpServer())
      .delete(`/tasks/${id}`)
      .expect(204);

    expect(deleteRes.body).toEqual({});
  });

  it('PATCH /tasks/:id returns 404 for unknown id', async () => {
    await request(app.getHttpServer())
      .patch('/tasks/nonexistent-id')
      .send({ title: 'Updated Title' })
      .expect(404);
  });

  it('PATCH /tasks/:id returns 200 with updated task for valid id', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Original Title', description: 'Original desc' })
      .expect(201);

    const id = createRes.body.id;

    const patchRes = await request(app.getHttpServer())
      .patch(`/tasks/${id}`)
      .send({ title: 'Updated Title' })
      .expect(200);

    expect(patchRes.body).toMatchObject({
      id,
      title: 'Updated Title',
      description: 'Original desc',
      status: 'OPEN',
    });
  });

  it('GET /tasks/:id returns 404 for unknown id', async () => {
    await request(app.getHttpServer())
      .get('/tasks/nonexistent-id')
      .expect(404);
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
