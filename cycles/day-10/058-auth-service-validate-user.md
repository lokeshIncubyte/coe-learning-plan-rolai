---
id: cycle-058
slug: auth-service-validate-user
status: done
source: "Day 10 user stories C/D (credential check feeds login) / checklist §2 validate credentials"
covers: happy-path, error-path
---
## Behavior
`AuthService.validateUser(email, password)` looks the user up with `prisma.user.findUnique({ where: { email } })`. If the user exists **and** `bcrypt.compare(password, user.password)` resolves true, it returns the user **without** the `password` field. If the user is missing, or the password does not match, it returns `null`.

## RED
- Test file: /home/lokesh/projects/coe-learning-plan-rolai/task-management-app/backend/src/auth/auth.service.spec.ts (append; reuses the cycle-056 mocks for PrismaService + bcrypt)
- Assertion:
```ts
// cycle-058 RED
it('validateUser() returns the user (no password) when bcrypt.compare matches', async () => {
  const stored = {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    password: '$2b$hashed',
    createdAt: new Date(),
  };
  mockPrisma.user.findUnique.mockResolvedValue(stored);
  (bcrypt.compare as jest.Mock).mockResolvedValue(true);

  const result = await service.validateUser('alice@example.com', 'S3cret!pw');

  expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'alice@example.com' } });
  expect(bcrypt.compare).toHaveBeenCalledWith('S3cret!pw', '$2b$hashed');
  expect(result).not.toHaveProperty('password');
  expect(result).toMatchObject({ id: '1', email: 'alice@example.com' });
});

// cycle-058 RED
it('validateUser() returns null when the user is missing', async () => {
  mockPrisma.user.findUnique.mockResolvedValue(null);

  const result = await service.validateUser('nobody@example.com', 'whatever');

  expect(result).toBeNull();
  expect(bcrypt.compare).not.toHaveBeenCalled();
});

// cycle-058 RED
it('validateUser() returns null when the password mismatches', async () => {
  mockPrisma.user.findUnique.mockResolvedValue({
    id: '1', name: 'Alice', email: 'alice@example.com', password: '$2b$hashed', createdAt: new Date(),
  });
  (bcrypt.compare as jest.Mock).mockResolvedValue(false);

  const result = await service.validateUser('alice@example.com', 'wrongPw');

  expect(result).toBeNull();
});
```
- Why it fails: `AuthService` has no `validateUser` method yet — TypeScript/Jest report it as undefined.

## GREEN
- Add:
```ts
async validateUser(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const { password: _omit, ...rest } = user;
  return rest;
}
```
- Files touched: src/auth/auth.service.ts

## REFACTOR
Reuse the same `stripPassword` shape used in `register` (return type consistency). The `!user.password` short-circuit guards seed users with a null password column — keep it.
