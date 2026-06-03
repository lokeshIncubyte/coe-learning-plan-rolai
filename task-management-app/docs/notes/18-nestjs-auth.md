# 18. NestJS Authentication — Passport, JWT Strategy, and Guards

## The moving parts
NestJS auth is built on top of [Passport.js](https://www.passportjs.org/), the de-facto Node.js auth middleware. The `@nestjs/passport` package wraps Passport so it feels like a native Nest concept. The chain is:

```
Request → Guard → Strategy → validate() → req.user → Controller
```

Each piece has a single responsibility.

## Passport strategies
A *strategy* is a named piece of logic that knows how to extract and verify a credential. `passport-jwt` is a strategy for JWTs. You subclass `PassportStrategy(Strategy)`, configure it in the constructor (where to look for the token, what secret to use), and implement `validate()` which runs after the token passes signature/expiry checks.

## Guards
A NestJS guard is a class that implements `CanActivate`. It runs before the route handler and decides whether the request is allowed through. `AuthGuard` from `@nestjs/passport` connects a named Passport strategy to the guard system: if the strategy throws or returns `false`, the guard returns a 401 automatically.

## How it's used in this project

**The module wiring** — `backend/src/auth/auth.module.ts`

`PassportModule` registers the Passport middleware. `JwtModule.register` configures signing and verification:

```ts
imports: [
  PassportModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
],
providers: [AuthService, JwtStrategy],
```

`JwtStrategy` must be listed in `providers` so Nest's DI container knows about it and Passport can find it by name.

**The strategy** — `backend/src/auth/jwt.strategy.ts`

```ts
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

- `fromAuthHeaderAsBearerToken()` — tells Passport to look in the `Authorization: Bearer <token>` header
- `ignoreExpiration: false` — expired tokens are rejected
- `validate()` — only called if the signature and expiry pass; its return value becomes `req.user`

**The guard** — `backend/src/auth/jwt-auth.guard.ts`

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

One line. `'jwt'` is the strategy name that `passport-jwt` registers automatically. The whole token-verification and `validate()` call chain runs inside `AuthGuard`.

**Protecting routes** — `backend/src/tasks/tasks.controller.ts`

Apply `@UseGuards(JwtAuthGuard)` to any route that requires authentication:

```ts
@Post()
@UseGuards(JwtAuthGuard)
async createTask(@Body() dto: CreateTaskDto) { … }

@Patch(':id')
@UseGuards(JwtAuthGuard)
async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) { … }

@Delete(':id')
@UseGuards(JwtAuthGuard)
@HttpCode(204)
async removeTask(@Param('id') id: string): Promise<void> { … }
```

`GET /tasks` and `GET /tasks/:id` are left unguarded — anyone can read tasks, but only authenticated users can create, edit, or delete them.

## Reading the user inside a handler
Because `validate()` returns `{ userId, email }`, that object is available as `req.user` inside any guarded handler via `@Req() req` or the `@CurrentUser()` decorator pattern — useful when you want to scope tasks to the logged-in user.

## Key insight
The guard rejects the request before it reaches your controller code. You don't write any `if (!user) return 401` logic — Passport and the guard handle that boundary completely.
