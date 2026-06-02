---
id: cycle-061
slug: auth-controller-login
status: done
source: "Day 10 user stories C/D (POST /auth/login → token / 401) / checklist §2 POST /auth/login"
covers: happy-path, error-path
---
## Behavior
`POST /auth/login` calls `AuthService.validateUser(email, password)`; on a truthy user it returns `AuthService.login(user)` (i.e. `{ access_token }`), and on `null` it throws `UnauthorizedException('Invalid credentials')` (HTTP 401). The handler is decorated `@HttpCode(200)` so login returns 200, not the POST default 201 (story C expects 200 OK).

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/auth.controller.spec.ts (append to the cycle-060 suite)
- Assertion:
```ts
import { UnauthorizedException } from '@nestjs/common';

// cycle-061 RED
it('login() returns the token when credentials are valid', async () => {
  const user = { id: '1', email: 'alice@example.com' };
  jest.spyOn(authService, 'validateUser').mockResolvedValue(user as any);
  jest.spyOn(authService, 'login').mockReturnValue({ access_token: 'signed.jwt.token' } as any);

  const result = await controller.login({ email: 'alice@example.com', password: 'S3cret!pw' } as any);

  expect(authService.validateUser).toHaveBeenCalledWith('alice@example.com', 'S3cret!pw');
  expect(authService.login).toHaveBeenCalledWith(user);
  expect(result).toEqual({ access_token: 'signed.jwt.token' });
});

// cycle-061 RED
it('login() throws UnauthorizedException when credentials are invalid', async () => {
  jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

  await expect(
    controller.login({ email: 'alice@example.com', password: 'wrongPw' } as any),
  ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  expect(authService.login).not.toHaveBeenCalled();
});
```
- Why it fails: `AuthController` (from cycle-060) has no `login` handler.

## GREEN
- Add to `AuthController`:
```ts
@Post('login')
@HttpCode(200)
async login(@Body() dto: LoginDto) {
  const user = await this.authService.validateUser(dto.email, dto.password);
  if (!user) throw new UnauthorizedException('Invalid credentials');
  return this.authService.login(user);
}
```
- Add `src/auth/dto/login.dto.ts` (`@IsEmail() email`, `@IsString() password`).
- Files touched: src/auth/auth.controller.ts, src/auth/dto/login.dto.ts (new)

## REFACTOR
None expected. Keep the validate-then-login two-step explicit for readability.
