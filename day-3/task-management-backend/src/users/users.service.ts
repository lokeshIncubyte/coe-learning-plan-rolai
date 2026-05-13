import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string; email: string }) {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (e) {
      if ((e as any).code === 'P2002') throw new ConflictException('Email already in use');
      throw e;
    }
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }
}
