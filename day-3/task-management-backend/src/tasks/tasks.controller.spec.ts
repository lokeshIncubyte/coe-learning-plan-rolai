import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatsService } from './tasks.stats.service';

jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

const mockTask = { id: '1', title: 'T', description: '', status: 'OPEN' };

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;
  let taskStatsService: TaskStatsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TasksService, useValue: { getAll: jest.fn(), create: jest.fn(), getById: jest.fn(), update: jest.fn(), remove: jest.fn() } },
        { provide: TaskStatsService, useValue: { getStats: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
    taskStatsService = module.get<TaskStatsService>(TaskStatsService);
  });

  // cycle-014 RED (updated for paginated shape)
  it('getAllTasks() awaits TasksService.getAll()', async () => {
    const paginated = { data: [mockTask], total: 1, page: 1, limit: 10 };
    jest.spyOn(tasksService, 'getAll').mockResolvedValue(paginated as any);

    const result = await controller.getAllTasks({ page: 1, limit: 10 } as any);

    expect(result).toStrictEqual(paginated);
  });

  // cycle-024 RED
  it('getAllTasks() passes pagination query to TasksService.getAll()', async () => {
    const paginated = { data: [mockTask], total: 1, page: 1, limit: 10 };
    jest.spyOn(tasksService, 'getAll').mockResolvedValue(paginated as any);
    const dto = { page: 1, limit: 10 } as any;

    const result = await controller.getAllTasks(dto);

    expect(tasksService.getAll).toHaveBeenCalledWith(dto);
    expect(result).toStrictEqual(paginated);
  });

  it('createTask() awaits TasksService.create()', async () => {
    jest.spyOn(tasksService, 'create').mockResolvedValue(mockTask as any);

    const result = await controller.createTask({ title: 'T', description: '' });

    expect(result).toStrictEqual(mockTask);
  });

  it('getTaskById() awaits TasksService.getById()', async () => {
    jest.spyOn(tasksService, 'getById').mockResolvedValue(mockTask as any);

    const result = await controller.getTaskById('1');

    expect(result).toStrictEqual(mockTask);
  });

  it('updateTask() awaits TasksService.update()', async () => {
    const updated = { ...mockTask, title: 'New' };
    jest.spyOn(tasksService, 'update').mockResolvedValue(updated as any);

    const result = await controller.updateTask('1', { title: 'New' });

    expect(result).toStrictEqual(updated);
  });

  it('removeTask() awaits TasksService.remove()', async () => {
    jest.spyOn(tasksService, 'remove').mockResolvedValue(undefined as any);

    await controller.removeTask('1');

    expect(tasksService.remove).toHaveBeenCalledWith('1');
  });

  it('getStats() awaits TaskStatsService.getStats()', async () => {
    const mockStats = { total: 3, open: 2 };
    jest.spyOn(taskStatsService, 'getStats').mockResolvedValue(mockStats as any);

    const result = await controller.getStats();

    expect(result).toStrictEqual(mockStats);
  });
});
