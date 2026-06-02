---
id: cycle-056
slug: auth-service-register-hashes
status: done
source: "Day 10 user story A (register, password stored hashed) / checklist §2 AuthService.register"
covers: happy-path
---
## Behavior
`AuthService.register({ name, email, password })` bcrypt-hashes the plaintext password, persists the user via `prisma.user.create` with the *hashed* password (never the plaintext), and returns the created user object **without** the `password` field.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/auth.service.spec.ts
- Mock both PrismaService and the `bcrypt` module so no real DB / no real hashing cost.
- Assertion:
```ts
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
```
- Why it fails: there is no `src/auth/auth.service.ts` (and no `AuthService`/`AuthModule`) yet — the import does not resolve.

## GREEN
- Create `src/auth/auth.service.ts` with `@Injectable() AuthService`, constructor-injecting `PrismaService` and `JwtService`.
- `register(dto)`: `const password = await bcrypt.hash(dto.password, 10);` then `const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email, password } });` then strip the field: `const { password: _omit, ...rest } = user; return rest;`
- Files touched: src/auth/auth.service.ts (new). Create `src/auth/auth.module.ts` providing `AuthService` only as much as needed to compile the spec (the spec wires providers directly, so the module is not strictly required for this RED — add it now or defer to cycle-060; keep this cycle minimal and add the module when the controller needs it).

## REFACTOR
Extract the salt-rounds literal (`10`) to a named const. Consider a small `stripPassword(user)` helper to be reused by `validateUser`/`login` later. Keep simple if not a clean fit.
