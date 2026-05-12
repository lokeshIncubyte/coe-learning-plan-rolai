import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string; email: string }) {
    return this.prisma.user.create({ data: dto });
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }
}
