import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { name: string; email: string }) {
    return this.prisma.user.create({ data: dto });
  }

  async getById(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { tasks: true } });
  }
}
