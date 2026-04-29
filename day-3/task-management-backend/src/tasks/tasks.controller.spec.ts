import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.interface';

const mockTask: Task = { id: '1', title: 'T', description: '', status: 'OPEN' };

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
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
});
