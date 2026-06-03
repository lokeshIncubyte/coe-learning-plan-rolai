# 17. Password Hashing with bcrypt

## Why you never store a plaintext password
If an attacker dumps your database they get every user's password. Because people reuse passwords, that one breach unlocks their email, bank, and everything else. Storing plaintext is a catastrophic risk and considered negligent.

## Hashing is not enough on its own
A plain SHA-256 hash is fast — an attacker with a GPU can try billions of guesses per second. Precomputed "rainbow tables" crack common passwords instantly. bcrypt solves both problems.

## What bcrypt does

**Salting:** before hashing, bcrypt prepends a random salt to the password. Two users with the same password get different hashes, defeating rainbow tables.

**Cost factor (work factor):** the algorithm runs a configurable number of rounds — in this project `SALT_ROUNDS = 10`, meaning 2¹⁰ = 1024 iterations. This makes each hash take ~100 ms on modern hardware. That's imperceptible for a login but makes brute-forcing millions of guesses expensive. Increase the cost factor over time as hardware improves.

**The stored hash encodes the salt and cost factor:**
```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhy7
 ↑   ↑  ↑ salt (22 chars) ↑ hash
 |   cost factor (10)
 bcrypt version (2b)
```

This means you don't need a separate column for the salt — everything is in the single hash string.

## How it's used in this project

**Hashing on register** — `backend/src/auth/auth.service.ts`

```ts
const SALT_ROUNDS = 10;

async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
  const password = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await this.prisma.user.create({
    data: { name: dto.name, email: dto.email, password },
  });
  return this.stripPassword(user);
}
```

The raw `dto.password` is hashed before it ever touches the database. The Prisma record stores the bcrypt string; the original password is gone.

**Verifying on login** — same file, `validateUser`:

```ts
const ok = await bcrypt.compare(password, user.password);
if (!ok) return null;
```

`bcrypt.compare` extracts the salt from the stored hash, hashes the candidate password the same way, and does a timing-safe comparison. You never need to store or retrieve the salt yourself.

**Never returning the hash** — `stripPassword` removes the `password` field from any user object before it leaves the service, so it can't leak into API responses.

## Key insight
bcrypt is intentionally slow. That is the feature. Never replace it with MD5, SHA-256, or any general-purpose hash — those are designed to be fast.
