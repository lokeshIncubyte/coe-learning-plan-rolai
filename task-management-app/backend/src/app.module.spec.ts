import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

// Prisma 7 generated client uses import.meta (ESM-only); mock it for Jest CJS
jest.mock('../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

it('AppModule provides PrismaService via PrismaModule', async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const prisma = module.get(PrismaService);
  expect(prisma).toBeDefined();
});

// cycle-021 RED
it('AppModule provides UsersService via UsersModule', async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { UsersService } = require('./users/users.service');
  const users = module.get(UsersService);
  expect(users).toBeDefined();
});
