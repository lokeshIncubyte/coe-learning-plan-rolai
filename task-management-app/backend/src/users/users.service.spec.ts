import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
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

  // cycle-025 RED
  it('create() throws ConflictException on duplicate email (P2002)', async () => {
    const p2002 = Object.assign(new Error('Unique constraint failed on email'), {
      code: 'P2002',
    });
    jest.spyOn(mockPrisma.user, 'create').mockRejectedValue(p2002);

    await expect(
      service.create({ name: 'Alice', email: 'alice@example.com' }),
    ).rejects.toThrow(new ConflictException('Email already in use'));
  });

  it('create() rethrows non-P2002 errors unchanged', async () => {
    const other = Object.assign(new Error('Connection lost'), { code: 'P1001' });
    jest.spyOn(mockPrisma.user, 'create').mockRejectedValue(other);

    await expect(
      service.create({ name: 'Alice', email: 'alice@example.com' }),
    ).rejects.toThrow('Connection lost');
  });

  // cycle-017 RED
  it('getById() calls findUnique with include: { tasks: true }', async () => {
    const user = { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date(), tasks: [] };
    jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(user as any);

    const result = await service.getById('1');

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' }, include: { tasks: true } });
    expect(result).toStrictEqual(user);
  });

  // cycle-018 RED
  it('getById() throws NotFoundException when findUnique returns null', async () => {
    jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.getById('no-such-id')).rejects.toThrow(NotFoundException);
  });
});
