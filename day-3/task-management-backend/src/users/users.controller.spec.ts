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

  // cycle-019 RED
  it('createUser() delegates to UsersService.create()', async () => {
    const dto = { name: 'Alice', email: 'alice@example.com' };
    const created = { id: '1', ...dto, createdAt: new Date(), tasks: [] };
    jest.spyOn(usersService, 'create').mockResolvedValue(created as any);

    const result = await controller.createUser(dto as any);

    expect(usersService.create).toHaveBeenCalledWith(dto);
    expect(result).toStrictEqual(created);
  });
});
