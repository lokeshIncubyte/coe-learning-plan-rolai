import { Test } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

// Prisma 7 generated client uses import.meta (ESM-only); mock it for Jest CJS
jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

it('PrismaModule exports PrismaService', async () => {
  const module = await Test.createTestingModule({
    imports: [PrismaModule],
  }).compile();
  const service = module.get(PrismaService);
  expect(service).toBeDefined();
});
