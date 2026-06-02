import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatsService } from './tasks.stats.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

const mockPrisma = {
  task: {
    count: jest.fn(),
  },
};

describe('TaskStatsService', () => {
  let statsService: TaskStatsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskStatsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    statsService = module.get<TaskStatsService>(TaskStatsService);
  });

  // cycle-013 RED
  it('getStats() calls prisma.task.count() for total and open', async () => {
    jest.spyOn(mockPrisma.task, 'count')
      .mockResolvedValueOnce(5)   // total
      .mockResolvedValueOnce(3);  // open

    const result = await statsService.getStats();

    expect(mockPrisma.task.count).toHaveBeenCalledTimes(2);
    expect(mockPrisma.task.count).toHaveBeenCalledWith({ where: { status: 'OPEN' } });
    expect(result).toStrictEqual({ total: 5, open: 3 });
  });
});
