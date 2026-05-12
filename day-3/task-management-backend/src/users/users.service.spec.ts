import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

const mockPrisma = {
  user: { create: jest.fn(), findUnique: jest.fn() },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('create() delegates to prisma.user.create()', async () => {
    const stored = { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date(), tasks: [] };
    jest.spyOn(mockPrisma.user, 'create').mockResolvedValue(stored as any);

    const result = await service.create({ name: 'Alice', email: 'alice@example.com' });

    expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: { name: 'Alice', email: 'alice@example.com' } });
    expect(result).toStrictEqual(stored);
  });

  // cycle-017 RED
  it('getById() calls findUnique with include: { tasks: true }', async () => {
    const user = { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date(), tasks: [] };
    jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(user as any);

    const result = await service.getById('1');

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' }, include: { tasks: true } });
    expect(result).toStrictEqual(user);
  });
});
