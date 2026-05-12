---
group: user-model-and-relation
status: pending
source: "day-6 checklist §3 — User model and one-to-many relationship"
---

> **Prisma note**: cycle-015 GREEN runs `npx prisma generate` (no DB needed). After cycle-015 is squash-merged,
> run `npx prisma migrate dev --name add-user-task-relation` once against Neon before starting cycle-016.
> Cycles 016–021 use mocks only and do not require DB access.

---

## cycle-015 — schema-user-model

```
id: cycle-015
slug: schema-user-model
covers: atomic
prerequisite: none
status: pending
```

### Behavior
`prisma/schema.prisma` gains a `User` model (`id`, `name`, `email`, `createdAt`, `tasks Task[]`) and `Task` gains an optional `userId String?` foreign key with `@relation`. Running `prisma generate` creates `generated/prisma/models/User.ts`.

### RED
- **Test file**: `src/prisma/prisma-schema.spec.ts`
- **Assertion**:
  ```ts
  it('User model exists in generated Prisma client', () => {
    const fs = require('fs');
    const path = require('path');
    const userModelPath = path.resolve(__dirname, '../../generated/prisma/models/User.ts');
    expect(fs.existsSync(userModelPath)).toBe(true);
  });
  ```
- **Why it fails**: `generated/prisma/models/User.ts` does not exist — no User model has been generated yet.

### GREEN
- **Smallest change**:
  1. Add `User` model to `prisma/schema.prisma`:
     ```prisma
     model User {
       id        String   @id @default(uuid())
       name      String
       email     String   @unique
       createdAt DateTime @default(now())
       tasks     Task[]
     }
     ```
  2. Add optional `userId` FK and `@relation` to `Task`:
     ```prisma
     userId String?
     user   User?   @relation(fields: [userId], references: [id])
     ```
  3. Run `npx prisma generate` (regenerates `generated/prisma/` — creates `User.ts`).
- **Files touched**: `prisma/schema.prisma` (run `npx prisma generate` as a side-effect command)

> **After squash-merge**: run `npx prisma migrate dev --name add-user-task-relation` to apply the schema to Neon.

### REFACTOR
None.

---

## cycle-016 — users-service-create

```
id: cycle-016
slug: users-service-create
covers: happy-path
prerequisite: cycle-015
group: user-model-and-relation
status: pending
```

### Behavior
`UsersService` accepts `PrismaService` in its constructor. `create()` is async and delegates to `prisma.user.create()`, returning the stored user record.

### RED
- **Test file**: `src/users/users.service.spec.ts` *(new file)*
- **Assertion**:
  ```ts
  import { Test, TestingModule } from '@nestjs/testing';
  import { UsersService } from './users.service';
  import { PrismaService } from '../prisma/prisma.service';

  jest.mock('../../generated/prisma/client', () => {
    class PrismaClient {
      $connect = jest.fn().mockResolvedValue(undefined);
      $disconnect = jest.fn().mockResolvedValue(undefined);
    }
    return { PrismaClient };
  });

  const mockPrisma = {
    user: { create: jest.fn(), findUnique: jest.fn() },
  };

  describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
      jest.clearAllMocks();
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          { provide: PrismaService, useValue: mockPrisma },
        ],
      }).compile();
      service = module.get<UsersService>(UsersService);
    });

    it('create() delegates to prisma.user.create()', async () => {
      const stored = { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date(), tasks: [] };
      jest.spyOn(mockPrisma.user, 'create').mockResolvedValue(stored as any);

      const result = await service.create({ name: 'Alice', email: 'alice@example.com' });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: { name: 'Alice', email: 'alice@example.com' } });
      expect(result).toStrictEqual(stored);
    });
  });
  ```
- **Why it fails**: `src/users/users.service.ts` does not exist — module-not-found error at import.

### GREEN
- **Smallest change**: Create `src/users/users.service.ts`:
  ```ts
  import { Injectable } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';

  @Injectable()
  export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: { name: string; email: string }) {
      return this.prisma.user.create({ data: dto });
    }
  }
  ```
- **Files touched**: `src/users/users.service.ts` *(new)*

### REFACTOR
None.

---

## cycle-017 — users-service-getbyid-happy

```
id: cycle-017
slug: users-service-getbyid-happy
covers: happy-path
prerequisite: cycle-016
group: user-model-and-relation
status: pending
```

### Behavior
`UsersService.getById()` is async and calls `prisma.user.findUnique({ where: { id }, include: { tasks: true } })`, returning the user with their tasks array.

### RED
- **Test file**: `src/users/users.service.spec.ts`
- **Assertion**:
  ```ts
  it('getById() calls findUnique with include: { tasks: true }', async () => {
    const user = { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date(), tasks: [] };
    jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(user as any);

    const result = await service.getById('1');

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' }, include: { tasks: true } });
    expect(result).toStrictEqual(user);
  });
  ```
- **Why it fails**: `getById()` does not exist on `UsersService` — `TypeError: service.getById is not a function`.

### GREEN
- **Smallest change**: Add to `UsersService`:
  ```ts
  async getById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
  }
  ```
- **Files touched**: `src/users/users.service.ts`

### REFACTOR
None.

---

## cycle-018 — users-service-getbyid-notfound

```
id: cycle-018
slug: users-service-getbyid-notfound
covers: error-path
prerequisite: cycle-017
group: user-model-and-relation
status: pending
```

### Behavior
When `prisma.user.findUnique()` returns `null`, `getById()` throws a `NotFoundException`.

### RED
- **Test file**: `src/users/users.service.spec.ts`
- **Assertion**:
  ```ts
  it('getById() throws NotFoundException when findUnique returns null', async () => {
    jest.spyOn(mockPrisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.getById('no-such-id')).rejects.toThrow(NotFoundException);
  });
  ```
- **Why it fails**: After cycle-017, `getById()` returns `null` directly — no null check exists.

### GREEN
- **Smallest change**: Wrap `findUnique` result with a null check in `getById()`:
  ```ts
  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }
  ```
  Also add `NotFoundException` to the import from `@nestjs/common`.
- **Files touched**: `src/users/users.service.ts`

### REFACTOR
None.

---

## cycle-019 — users-controller-post

```
id: cycle-019
slug: users-controller-post
covers: happy-path
prerequisite: cycle-016
group: user-model-and-relation
status: pending
```

### Behavior
`UsersController` exists with a `POST /users` route that delegates to `UsersService.create()` and returns the created user.

### RED
- **Test file**: `src/users/users.controller.spec.ts` *(new file)*
- **Assertion**:
  ```ts
  import { Test, TestingModule } from '@nestjs/testing';
  import { UsersController } from './users.controller';
  import { UsersService } from './users.service';

  jest.mock('../../generated/prisma/client', () => {
    class PrismaClient {
      $connect = jest.fn().mockResolvedValue(undefined);
      $disconnect = jest.fn().mockResolvedValue(undefined);
    }
    return { PrismaClient };
  });

  describe('UsersController', () => {
    let controller: UsersController;
    let usersService: UsersService;

    beforeEach(async () => {
      jest.clearAllMocks();
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          { provide: UsersService, useValue: { create: jest.fn(), getById: jest.fn() } },
        ],
      }).compile();
      controller = module.get<UsersController>(UsersController);
      usersService = module.get<UsersService>(UsersService);
    });

    it('createUser() delegates to UsersService.create()', async () => {
      const dto = { name: 'Alice', email: 'alice@example.com' };
      const created = { id: '1', ...dto, createdAt: new Date(), tasks: [] };
      jest.spyOn(usersService, 'create').mockResolvedValue(created as any);

      const result = await controller.createUser(dto as any);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toStrictEqual(created);
    });
  });
  ```
- **Why it fails**: `src/users/users.controller.ts` does not exist — module-not-found at import.

### GREEN
- **Smallest change**:
  1. Create `src/users/dto/create-user.dto.ts`:
     ```ts
     import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

     export class CreateUserDto {
       @IsString()
       @IsNotEmpty()
       name: string;

       @IsEmail()
       email: string;
     }
     ```
  2. Create `src/users/users.controller.ts`:
     ```ts
     import { Controller, Get, Post, Body, Param } from '@nestjs/common';
     import { UsersService } from './users.service';
     import { CreateUserDto } from './dto/create-user.dto';

     @Controller('users')
     export class UsersController {
       constructor(private readonly usersService: UsersService) {}

       @Post()
       async createUser(@Body() dto: CreateUserDto) {
         return this.usersService.create(dto);
       }
     }
     ```
- **Files touched**: `src/users/users.controller.ts` *(new)*, `src/users/dto/create-user.dto.ts` *(new)*

### REFACTOR
None.

---

## cycle-020 — users-controller-getbyid

```
id: cycle-020
slug: users-controller-getbyid
covers: happy-path
prerequisite: cycle-019
group: user-model-and-relation
status: pending
```

### Behavior
`UsersController` has a `GET /users/:id` route that delegates to `UsersService.getById()` and returns the user with their tasks.

### RED
- **Test file**: `src/users/users.controller.spec.ts`
- **Assertion**:
  ```ts
  it('getUserById() delegates to UsersService.getById()', async () => {
    const user = { id: '1', name: 'Alice', email: 'alice@example.com', createdAt: new Date(), tasks: [] };
    jest.spyOn(usersService, 'getById').mockResolvedValue(user as any);

    const result = await controller.getUserById('1');

    expect(usersService.getById).toHaveBeenCalledWith('1');
    expect(result).toStrictEqual(user);
  });
  ```
- **Why it fails**: `UsersController.getUserById()` does not exist after cycle-019 GREEN — `TypeError: controller.getUserById is not a function`.

### GREEN
- **Smallest change**: Add `GET /users/:id` to `UsersController`:
  ```ts
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }
  ```
- **Files touched**: `src/users/users.controller.ts`

### REFACTOR
None.

---

## cycle-021 — users-module-wiring

```
id: cycle-021
slug: users-module-wiring
covers: atomic
prerequisite: cycle-020
group: user-model-and-relation
status: pending
```

### Behavior
`UsersModule` exists and is registered in `AppModule`. `AppModule` can compile and provides `UsersService` through the module graph.

### RED
- **Test file**: `src/app.module.spec.ts`
- **Assertion**:
  ```ts
  it('AppModule provides UsersService via UsersModule', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const { UsersService } = await import('./users/users.service');
    const users = module.get(UsersService);
    expect(users).toBeDefined();
  });
  ```
- **Why it fails**: `AppModule` does not import `UsersModule` — `module.get(UsersService)` throws a Nest DI error.

### GREEN
- **Smallest change**:
  1. Create `src/users/users.module.ts`:
     ```ts
     import { Module } from '@nestjs/common';
     import { UsersController } from './users.controller';
     import { UsersService } from './users.service';

     @Module({
       controllers: [UsersController],
       providers: [UsersService],
     })
     export class UsersModule {}
     ```
  2. Add `UsersModule` import to `src/app.module.ts`.
- **Files touched**: `src/users/users.module.ts` *(new)*, `src/app.module.ts`

### REFACTOR
None.
