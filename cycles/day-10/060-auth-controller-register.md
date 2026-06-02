---
id: cycle-060
slug: auth-controller-register
status: done
source: "Day 10 user story A (POST /auth/register → 201) / checklist §2 POST /auth/register"
covers: happy-path
---
## Behavior
`POST /auth/register` delegates to `AuthService.register(dto)` and returns the created user (without password). NestJS defaults a `@Post()` to **201 Created**. Mirrors `UsersController.createUser` delegation convention.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/auth.controller.spec.ts
- Mock `AuthService` directly (no Prisma needed at controller layer), matching the `users.controller.spec.ts` pattern.
- Assertion:
```ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('../../generated/prisma/client', () => {
  class PrismaClient {
    $connect = jest.fn().mockResolvedValue(undefined);
    $disconnect = jest.fn().mockResolvedValue(undefined);
  }
  return { PrismaClient };
});

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: { register: jest.fn(), validateUser: jest.fn(), login: jest.fn() } },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // cycle-060 RED
  it('register() delegates to AuthService.register()', async () => {
    const dto = { name: 'Alice', email: 'alice@example.com', password: 'S3cret!pw' };
    const created = { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date() };
    jest.spyOn(authService, 'register').mockResolvedValue(created as any);

    const result = await controller.register(dto as any);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toStrictEqual(created);
  });
});
```
- Why it fails: there is no `src/auth/auth.controller.ts` / `AuthController` yet.

## GREEN
- Create `src/auth/auth.controller.ts`:
```ts
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
```
- Add `src/auth/dto/register.dto.ts` (`class-validator`: `@IsString() name`, `@IsEmail() email`, `@IsString() @MinLength(8) password`) following the `CreateUserDto` style.
- Wire `src/auth/auth.module.ts`: `controllers: [AuthController]`, `providers: [AuthService]`, and import `JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '1h' } })`. Register `AuthModule` in `AppModule`.
- Files touched: src/auth/auth.controller.ts (new), src/auth/dto/register.dto.ts (new), src/auth/auth.module.ts, src/app.module.ts

## REFACTOR
Prefer `JwtModule.registerAsync` with `ConfigService` if a ConfigModule is already present; otherwise keep the static `register` reading `process.env`. Keep simple.
