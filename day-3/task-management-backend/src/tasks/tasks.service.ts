import { Injectable, NotFoundException } from '@nestjs/common';
import type { Task } from '../../generated/prisma/models/Task';
import { TaskStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(pagination: PaginationDto): Promise<{ data: Task[]; total: number; page: number; limit: number }> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await Promise.all([
      this.prisma.task.findMany({ skip, take: pagination.limit }) as any,
      this.prisma.task.count(),
    ]);
    return { data, total, page: pagination.page, limit: pagination.limit };
  }

  async getById(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task as any;
  }

  private rethrowNotFound(e: unknown, id: string): never {
    if ((e as any).code === 'P2025') throw new NotFoundException(`Task #${id} not found`);
    throw e;
  }

  async update(id: string, dto: Partial<{ title: string; description: string; status: TaskStatus }>): Promise<Task> {
    try {
      return await this.prisma.task.update({ where: { id }, data: dto }) as any;
    } catch (e) {
      this.rethrowNotFound(e, id);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.task.delete({ where: { id } });
    } catch (e) {
      this.rethrowNotFound(e, id);
    }
  }

  async create(dto: { title: string; description: string; status?: TaskStatus }): Promise<Task> {
    return this.prisma.task.create({ data: { title: dto.title, description: dto.description } }) as any;
  }
}
