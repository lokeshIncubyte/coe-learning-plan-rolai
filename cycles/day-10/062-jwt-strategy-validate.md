---
id: cycle-062
slug: jwt-strategy-validate
status: done
source: "Day 10 user stories E/G (guard attaches user / rejects bad token) / checklist §3 JwtStrategy"
covers: happy-path
---
## Behavior
`JwtStrategy` (extends `PassportStrategy(Strategy)` from `passport-jwt`) is configured to read the bearer token from the `Authorization` header and verify it with `JWT_SECRET`. Its `validate(payload)` returns `{ userId: payload.sub, email: payload.email }`, which Passport attaches to `request.user`. Signature verification/expiry is handled by passport-jwt itself (story G); this cycle unit-tests only the `validate` mapping.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/jwt.strategy.spec.ts
- No Prisma involved; instantiate the strategy directly (`JWT_SECRET` must be set for the super() call, so set it in the test).
- Assertion:
```ts
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    strategy = new JwtStrategy();
  });

  // cycle-062 RED
  it('validate() maps the payload to { userId, email }', () => {
    const result = strategy.validate({ sub: '1', email: 'alice@example.com' });

    expect(result).toEqual({ userId: '1', email: 'alice@example.com' });
  });
});
```
- Why it fails: there is no `src/auth/jwt.strategy.ts` / `JwtStrategy` yet.

## GREEN
- Create `src/auth/jwt.strategy.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
```
- Also create `src/auth/jwt-auth.guard.ts` — `export class JwtAuthGuard extends AuthGuard('jwt') {}` (needed by cycle-063).
- Register `JwtStrategy` (and `PassportModule`) in `AuthModule.providers`/imports.
- Files touched: src/auth/jwt.strategy.ts (new), src/auth/jwt-auth.guard.ts (new), src/auth/auth.module.ts

## REFACTOR
Move the `JWT_SECRET` read behind `ConfigService` if a ConfigModule exists; otherwise leave `process.env.JWT_SECRET!`. Keep simple.
