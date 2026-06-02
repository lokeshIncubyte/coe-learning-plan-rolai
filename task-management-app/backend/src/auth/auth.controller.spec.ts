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
