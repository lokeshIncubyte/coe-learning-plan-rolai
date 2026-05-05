import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatsService } from './tasks.stats.service';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.interface';

describe('TaskStatsService', () => {
  let statsService: TaskStatsService;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskStatsService,
        { provide: TasksService, useValue: { getAll: jest.fn() } },
      ],
    }).compile();

    statsService = module.get<TaskStatsService>(TaskStatsService);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('getStats() returns total and open count from TasksService', () => {
    jest.spyOn(tasksService, 'getAll').mockReturnValue([
      { id: '1', title: 'A', description: '', status: TaskStatus.OPEN },
      { id: '2', title: 'B', description: '', status: TaskStatus.DONE },
    ]);
    expect(statsService.getStats()).toStrictEqual({ total: 2, open: 1 });
  });
});
