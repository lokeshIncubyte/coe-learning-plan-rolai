---
id: cycle-057
slug: auth-service-register-conflict
status: done
source: "Day 10 user story B (register duplicate email → 409) / checklist §2"
covers: error-path
---
## Behavior
When `prisma.user.create` rejects with Prisma error code `P2002` (unique-constraint violation on email), `AuthService.register` throws a `ConflictException` with message `"Email already in use"` (HTTP 409). Non-`P2002` errors are re-thrown unchanged. Mirrors the existing `UsersService.create` convention.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/auth.service.spec.ts (append to the suite from cycle-056)
- Assertion:
```ts
import { ConflictException } from '@nestjs/common';

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
```
- Why it fails: cycle-056's `register` has no try/catch — the raw `P2002` error propagates instead of a `ConflictException`.

## GREEN
- Wrap the `prisma.user.create` (+ strip) in try/catch:
```ts
try {
  const user = await this.prisma.user.create({ data: { ... } });
  const { password: _omit, ...rest } = user;
  return rest;
} catch (e) {
  if ((e as any).code === 'P2002') throw new ConflictException('Email already in use');
  throw e;
}
```
- Files touched: src/auth/auth.service.ts

## REFACTOR
The P2002→Conflict mapping now exists in both `UsersService` and `AuthService`. Note the duplication but do not extract a shared helper unless it is clean; keep the two call sites independent for now.
