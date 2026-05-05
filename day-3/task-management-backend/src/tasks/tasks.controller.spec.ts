import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatsService } from './tasks.stats.service';
import { Task } from './task.interface';

const mockTask: Task = { id: '1', title: 'T', description: '', status: 'OPEN' };

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: TaskStatsService, useValue: { getStats: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('getAllTasks() returns whatever TasksService.getAll() returns', () => {
    jest.spyOn(tasksService, 'getAll').mockReturnValue([mockTask]);
    expect(controller.getAllTasks()).toStrictEqual([mockTask]);
  });

  it('createTask() returns the task created by TasksService.create()', () => {
    const dto = { title: 'Write tests', description: 'Red first' };
    const expected: Task = { id: 'abc', title: 'Write tests', description: 'Red first', status: 'OPEN' };
    jest.spyOn(tasksService, 'create').mockReturnValue(expected);
    expect(controller.createTask(dto)).toStrictEqual(expected);
  });

  it('getTaskById() returns the task from the service', () => {
    jest.spyOn(tasksService, 'getById').mockReturnValue(mockTask);
    expect(controller.getTaskById('1')).toStrictEqual(mockTask);
  });

  it('updateTask() returns the updated task from the service', () => {
    const dto = { title: 'New' };
    const updated: Task = { ...mockTask, title: 'New' };
    jest.spyOn(tasksService, 'update').mockReturnValue(updated);
    expect(controller.updateTask('1', dto)).toStrictEqual(updated);
  });

  it('removeTask() calls service.remove() with the given id', () => {
    const spy = jest.spyOn(tasksService, 'remove').mockReturnValue();
    controller.removeTask('1');
    expect(spy).toHaveBeenCalledWith('1');
  });
});
