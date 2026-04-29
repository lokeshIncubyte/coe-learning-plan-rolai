import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('getAll() returns an empty array on a fresh service', () => {
    expect(service.getAll()).toStrictEqual([]);
  });

  it('create() returns the new task with id, title, description, and status OPEN', () => {
    const task = service.create({ title: 'Buy milk', description: 'Full fat' });
    expect(task).toMatchObject({ title: 'Buy milk', description: 'Full fat', status: 'OPEN' });
    expect(typeof task.id).toBe('string');
    expect(task.id.length).toBeGreaterThan(0);
  });

  it('create() persists the task so getAll() returns it', () => {
    const task = service.create({ title: 'Buy milk', description: 'Full fat' });
    expect(service.getAll()).toHaveLength(1);
    expect(service.getAll()[0]).toStrictEqual(task);
  });
});
