---
id: cycle-025
slug: users-service-create-p2002
status: done
source: "Catch PrismaClientKnownRequestError with code P2002 (unique constraint) → HTTP 409"
covers: error-path
group: error-handling
---

## Behavior
`UsersService.create()` catches `PrismaClientKnownRequestError` with code `P2002` (duplicate email) and throws `ConflictException` (HTTP 409) instead of leaking the raw Prisma error.

## RED
- **Test file**: `src/users/users.service.spec.ts`
- **Assertion**:
  ```ts
  import { ConflictException, NotFoundException } from '@nestjs/common'; // add ConflictException

  it('create() throws ConflictException on duplicate email (P2002)', async () => {
    const p2002 = Object.assign(new Error('Unique constraint failed on email'), {
      code: 'P2002',
      name: 'PrismaClientKnownRequestError',
    });
    jest.spyOn(mockPrisma.user, 'create').mockRejectedValue(p2002);

    await expect(
      service.create({ name: 'Alice', email: 'alice@example.com' }),
    ).rejects.toThrow(ConflictException);
  });
  ```
- **Why it fails**: `create()` has no try/catch — the raw P2002 error propagates, not a `ConflictException`.

## GREEN
- **Smallest change**: Wrap `prisma.user.create` in try/catch; if `(e as any).code === 'P2002'` throw `new ConflictException('Email already in use')`, otherwise rethrow.
  ```ts
  import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

  async create(dto: { name: string; email: string }) {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (e) {
      if ((e as any).code === 'P2002') throw new ConflictException('Email already in use');
      throw e;
    }
  }
  ```
- **Files touched**: `src/users/users.service.ts`, `src/users/users.service.spec.ts` (add test + import)

## REFACTOR
None.
