import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockPrisma = {
  user: { create: jest.fn(), findUnique: jest.fn() },
};
const mockJwt = { sign: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  // cycle-056 RED
  it('register() hashes the password and returns the user without password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$hashed');
    const stored = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      password: '$2b$hashed',
      createdAt: new Date(),
    };
    mockPrisma.user.create.mockResolvedValue(stored);

    const result = await service.register({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'S3cret!pw',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('S3cret!pw', expect.any(Number));
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { name: 'Alice', email: 'alice@example.com', password: '$2b$hashed' },
    });
    expect(result).not.toHaveProperty('password');
    expect(result).toMatchObject({ id: '1', email: 'alice@example.com', name: 'Alice' });
  });

  // cycle-057 RED
  it('register() throws ConflictException on duplicate email (P2002)', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$hashed');
    const p2002 = Object.assign(new Error('Unique constraint failed on email'), {
      code: 'P2002',
    });
    mockPrisma.user.create.mockRejectedValue(p2002);

    await expect(
      service.register({ name: 'Alice', email: 'alice@example.com', password: 'S3cret!pw' }),
    ).rejects.toThrow(new ConflictException('Email already in use'));
  });

  // cycle-057 RED
  it('register() rethrows non-P2002 errors unchanged', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$hashed');
    const other = Object.assign(new Error('Connection lost'), { code: 'P1001' });
    mockPrisma.user.create.mockRejectedValue(other);

    await expect(
      service.register({ name: 'Alice', email: 'alice@example.com', password: 'S3cret!pw' }),
    ).rejects.toThrow('Connection lost');
  });

  // cycle-058 RED
  it('validateUser() returns the user (no password) when bcrypt.compare matches', async () => {
    const stored = {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      password: '$2b$hashed',
      createdAt: new Date(),
    };
    mockPrisma.user.findUnique.mockResolvedValue(stored);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser('alice@example.com', 'S3cret!pw');

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'alice@example.com' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('S3cret!pw', '$2b$hashed');
    expect(result).not.toHaveProperty('password');
    expect(result).toMatchObject({ id: '1', email: 'alice@example.com' });
  });

  // cycle-058 RED
  it('validateUser() returns null when the user is missing', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const result = await service.validateUser('nobody@example.com', 'whatever');

    expect(result).toBeNull();
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  // cycle-058 RED
  it('validateUser() returns null when the password mismatches', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: '1', name: 'Alice', email: 'alice@example.com', password: '$2b$hashed', createdAt: new Date(),
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await service.validateUser('alice@example.com', 'wrongPw');

    expect(result).toBeNull();
  });
});
