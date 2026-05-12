import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Task[]> {
    return this.prisma.task.findMany() as any;
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
