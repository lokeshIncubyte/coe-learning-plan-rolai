---
id: cycle-004
slug: app-module-imports-prisma
status: done
source: "Import PrismaModule in AppModule"
covers: happy-path
group: nestjs-prisma-wiring
---

## Behavior
AppModule imports PrismaModule, making PrismaService available for injection anywhere in the application without requiring each feature module to import PrismaModule explicitly.

## RED
- **Test file**: `src/app.module.spec.ts`
- **Assertion**:
  ```ts
  import { Test } from '@nestjs/testing';
  import { AppModule } from './app.module';
  import { PrismaService } from './prisma/prisma.service';

  it('AppModule provides PrismaService via PrismaModule', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const prisma = module.get(PrismaService);
    expect(prisma).toBeDefined();
  });
  ```
- **Why it fails**: `AppModule` only imports `TasksModule` — `PrismaService` is not in the DI container, so `module.get(PrismaService)` throws.

## GREEN
- **Smallest change**: Add `PrismaModule` to the `imports` array in `AppModule`.
- **Files touched**: `src/app.module.ts`

## REFACTOR
none
