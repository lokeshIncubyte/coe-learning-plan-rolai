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

  it('create() delegates to prisma.task.create()', async () => {
    const stored = { id: '1', title: 'T', description: 'D', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(mockPrisma.task, 'create').mockResolvedValue(stored as any);
    const result = await service.create({ title: 'T', description: 'D' });
    expect(mockPrisma.task.create).toHaveBeenCalledWith({ data: { title: 'T', description: 'D' } });
    expect(result).toStrictEqual(stored);
  });

  it('getAll() delegates to prisma.task.findMany()', async () => {
    const rows = [{ id: '1', title: 'T', description: '', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() }];
    jest.spyOn(mockPrisma.task, 'findMany').mockResolvedValue(rows as any);
    const result = await service.getAll();
    expect(mockPrisma.task.findMany).toHaveBeenCalled();
    expect(result).toStrictEqual(rows);
  });

  it('getById() delegates to prisma.task.findUnique()', async () => {
    const row = { id: '1', title: 'T', description: '', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(mockPrisma.task, 'findUnique').mockResolvedValue(row as any);
    const result = await service.getById('1');
    expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toStrictEqual(row);
  });

  // cycle-009 RED
  it('update() delegates to prisma.task.update()', async () => {
    const row = { id: '1', title: 'New', description: '', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
    jest.spyOn(mockPrisma.task, 'update').mockResolvedValue(row as any);
    const result = await service.update('1', { title: 'New' });
    expect(mockPrisma.task.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { title: 'New' } });
    expect(result).toStrictEqual(row);
  });

  it('getById() throws NotFoundException when findUnique returns null', async () => {
    jest.spyOn(mockPrisma.task, 'findUnique').mockResolvedValue(null);
    await expect(service.getById('no-such-id')).rejects.toThrow(NotFoundException);
  });

  // cycle-010 RED
  it('update() throws NotFoundException on P2025', async () => {
    jest.spyOn(mockPrisma.task, 'update').mockRejectedValue(p2025);

    await expect(service.update('ghost', { title: 'X' })).rejects.toThrow(NotFoundException);
  });
});
