---
id: cycle-002
slug: prisma-service-lifecycle
status: done
source: "Create src/prisma/prisma.service.ts extending PrismaClient, implementing OnModuleInit and OnModuleDestroy"
covers: happy-path
group: nestjs-prisma-wiring
---

## Behavior
PrismaService is an injectable NestJS service that extends PrismaClient and exposes `onModuleInit` (calls `$connect`) and `onModuleDestroy` (calls `$disconnect`) lifecycle hooks, allowing NestJS to manage the database connection.

## RED
- **Test file**: `src/prisma/prisma.service.spec.ts`
- **Assertion**:
  ```ts
  import { Test } from '@nestjs/testing';
  import { PrismaService } from './prisma.service';

  it('PrismaService is injectable and has lifecycle hooks', async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();
    const service = module.get(PrismaService);
    expect(typeof service.onModuleInit).toBe('function');
    expect(typeof service.onModuleDestroy).toBe('function');
  });
  ```
- **Why it fails**: `src/prisma/prisma.service.ts` does not exist — the import throws `Cannot find module`.

## GREEN
- **Smallest change**: Create `src/prisma/prisma.service.ts` with `@Injectable() PrismaService extends PrismaClient` implementing `OnModuleInit` (calls `this.$connect()`) and `OnModuleDestroy` (calls `this.$disconnect()`).
- **Files touched**: `src/prisma/prisma.service.ts`

## REFACTOR
none
