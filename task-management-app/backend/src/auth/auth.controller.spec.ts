import { UnauthorizedException } from '@nestjs/common';
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

  // cycle-064 RED — GET /auth/me returns the authenticated user from the JWT
  it('me() returns the current user (id + email) from the request', () => {
    const req = { user: { userId: 'u-123', email: 'alice@example.com' } };
    expect(controller.me(req as any)).toEqual({ id: 'u-123', email: 'alice@example.com' });
  });
});
