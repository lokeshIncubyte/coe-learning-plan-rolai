---
id: cycle-059
slug: auth-service-login-token
status: done
source: "Day 10 user story C (login returns a signed JWT) / checklist §2 return a signed JWT"
covers: happy-path
---
## Behavior
`AuthService.login(user)` returns `{ access_token }` where the token comes from `JwtService.sign` with payload `{ sub: user.id, email: user.email }`.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/auth.service.spec.ts (append; reuses the `mockJwt` provider from cycle-056)
- Assertion:
```ts
// cycle-059 RED
it('login() signs a JWT with { sub, email } and returns { access_token }', () => {
  mockJwt.sign.mockReturnValue('signed.jwt.token');

  const result = service.login({ id: '1', email: 'alice@example.com' } as any);

  expect(mockJwt.sign).toHaveBeenCalledWith({ sub: '1', email: 'alice@example.com' });
  expect(result).toEqual({ access_token: 'signed.jwt.token' });
});
```
- Why it fails: `AuthService` has no `login` method yet.

## GREEN
- Add:
```ts
login(user: { id: string; email: string }) {
  const payload = { sub: user.id, email: user.email };
  return { access_token: this.jwt.sign(payload) };
}
```
- Files touched: src/auth/auth.service.ts

## REFACTOR
None expected. `JwtService` is configured (secret + expiry) at the module level in cycle-060/063 wiring, not here.
