import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatsService } from './tasks.stats.service';
import { TasksService } from './tasks.service';

describe('TaskStatsService', () => {
  let statsService: TaskStatsService;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskStatsService,
        {
          provide: TasksService,
          useValue: { getAll: jest.fn() },
        },
      ],
    }).compile();

    statsService = module.get<TaskStatsService>(TaskStatsService);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('getStats() returns total and open count from TasksService', () => {
    jest.spyOn(tasksService, 'getAll').mockReturnValue([
      { id: '1', title: 'A', description: '', status: 'OPEN' as any },
      { id: '2', title: 'B', description: '', status: 'DONE' as any },
    ]);
    expect(statsService.getStats()).toStrictEqual({ total: 2, open: 1 });
  });
});
