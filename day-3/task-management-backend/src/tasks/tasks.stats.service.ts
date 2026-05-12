import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<{ total: number; open: number }> {
    const [total, open] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.task.count({ where: { status: 'OPEN' } }),
    ]);
    return { total, open };
  }
}
