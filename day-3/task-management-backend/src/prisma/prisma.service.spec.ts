import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

// Prisma 7 generated client uses import.meta (ESM-only); mock it for Jest CJS
jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

it('PrismaService is injectable and has lifecycle hooks', async () => {
  const module = await Test.createTestingModule({
    providers: [PrismaService],
  }).compile();
  const service = module.get(PrismaService);
  expect(typeof service.onModuleInit).toBe('function');
  expect(typeof service.onModuleDestroy).toBe('function');
});
