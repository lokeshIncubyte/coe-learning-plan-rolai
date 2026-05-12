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
    return this.prisma.task.findUnique({ where: { id } }) as any;
  }

  update(id: string, dto: Partial<{ title: string; description: string; status: TaskStatus }>): Task {
    this.getById(id);
    return {} as Task;
  }

  remove(id: string): void {
    this.getById(id);
  }

  async create(dto: { title: string; description: string; status?: TaskStatus }): Promise<Task> {
    return this.prisma.task.create({ data: { title: dto.title, description: dto.description } }) as any;
  }
}
