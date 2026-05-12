---
id: cycle-003
slug: prisma-module-global
status: done
source: "Create src/prisma/prisma.module.ts — declare PrismaService as provider, export it, mark @Global()"
covers: happy-path
group: nestjs-prisma-wiring
---

## Behavior
PrismaModule is a `@Global()` NestJS module that provides and exports PrismaService, making it available for injection across the entire application without requiring each feature module to import PrismaModule explicitly.

## RED
- **Test file**: `src/prisma/prisma.module.spec.ts`
- **Assertion**:
  ```ts
  import { Test } from '@nestjs/testing';
  import { PrismaModule } from './prisma.module';
  import { PrismaService } from './prisma.service';

  it('PrismaModule exports PrismaService', async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();
    const service = module.get(PrismaService);
    expect(service).toBeDefined();
  });
  ```
- **Why it fails**: `src/prisma/prisma.module.ts` does not exist — the import throws `Cannot find module`.

## GREEN
- **Smallest change**: Create `src/prisma/prisma.module.ts` decorated with `@Global()` and `@Module({ providers: [PrismaService], exports: [PrismaService] })`.
- **Files touched**: `src/prisma/prisma.module.ts`

## REFACTOR
none
