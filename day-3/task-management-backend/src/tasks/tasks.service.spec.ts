import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

// Prisma 7 generated client uses import.meta (ESM-only); mock it for Jest CJS
jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

const mockPrisma = {
  task: {
    create:     jest.fn(),
    findMany:   jest.fn(),
    findUnique: jest.fn(),
    update:     jest.fn(),
    delete:     jest.fn(),
    count:      jest.fn(),
  },
};

const p2025 = Object.assign(new Error('Record not found'), {
  code: 'P2025',
  name: 'PrismaClientKnownRequestError',
});

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  // cycle-005: create() async via prisma
  it('create() delegates to prisma.task.create()', async () => {
    const dto = { title: 'T', description: 'D' };
    const stored = { id: '1', title: 'T', description: 'D', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(mockPrisma.task, 'create').mockResolvedValue(stored as any);

    const result = await service.create(dto);

    expect(mockPrisma.task.create).toHaveBeenCalledWith({ data: { title: 'T', description: 'D' } });
    expect(result).toStrictEqual(stored);
  });

  // getById / update / remove error paths still work via in-memory stub
  it('getById() throws NotFoundException when task does not exist', () => {
    expect(() => service.getById('no-such-id')).toThrow(NotFoundException);
  });

  it('update() throws NotFoundException when task does not exist', () => {
    expect(() => service.update('ghost', { title: 'X' })).toThrow(NotFoundException);
  });

  it('remove() throws NotFoundException when task does not exist', () => {
    expect(() => service.remove('ghost')).toThrow(NotFoundException);
  });
});
