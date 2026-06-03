# 16. JWT — JSON Web Tokens

## What it is
A JWT (JSON Web Token) is a compact, self-contained string that proves a claim — "I am user X" — without the server needing to look anything up in a database on every request. The server issues one at login and the client sends it back on every subsequent request.

## Structure
A JWT is three Base64URL-encoded segments joined by dots:

```
eyJhbGciOiJIUzI1NiJ9   ← Header  (algorithm + token type)
.eyJzdWIiOiJhYmMxMjMiLCJlbWFpbCI6InVAZS5jb20iLCJpYXQiOjE3MDAsImV4cCI6MTcwMzYwMH0
                        ← Payload (the claims: sub, email, iat, exp, …)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
                        ← Signature (HMAC-SHA256 of header + payload using the secret)
```

- **`sub`** — the subject, typically the user's database ID
- **`iat`** — issued-at timestamp
- **`exp`** — expiry timestamp; the library rejects tokens past this time
- **Signature** — guarantees that nobody tampered with the payload; only someone who knows `JWT_SECRET` could have produced it

Because the signature covers the payload, any change to the payload (e.g., swapping the `sub` to another user's ID) breaks the signature and the token is rejected.

## Signing vs. encrypting
A JWT is *signed*, not *encrypted*. The payload is readable by anyone — paste one into [jwt.io](https://jwt.io) and you'll see the claims. **Never put secrets inside a JWT payload.** The value is the unforgeable signature, not secrecy.

## How it's used in this project

**Issuing the token** — `backend/src/auth/auth.service.ts`

`AuthService.login` puts the user's `id` and `email` into the payload and calls `this.jwt.sign()`:

```ts
login(user: { id: string; email: string }) {
  const payload = { sub: user.id, email: user.email };
  return { access_token: this.jwt.sign(payload) };
}
```

**Module configuration** — `backend/src/auth/auth.module.ts`

The `JwtModule` is registered with the secret from `JWT_SECRET` and a one-hour expiry:

```ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
})
```

**Verifying the token** — `backend/src/auth/jwt.strategy.ts`

On protected routes, Passport extracts the token from the `Authorization: Bearer …` header, verifies the signature and expiry against the same secret, then calls `validate()` with the decoded payload. Whatever `validate()` returns is attached to `req.user`:

```ts
validate(payload: { sub: string; email: string }) {
  return { userId: payload.sub, email: payload.email };
}
```

## Key insight
The token is the credential. Whoever holds it can act as that user until it expires — so keep expiry short (this project uses `1h`) and transmit only over HTTPS.
