import { Test, TestingModule } from '@nestjs/testing';
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
});
