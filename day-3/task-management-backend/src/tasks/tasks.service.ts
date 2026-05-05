import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.interface';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  getById(id: string): Task {
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task #${id} not found`);
    }
    return task;
  }

  update(id: string, dto: Partial<{ title: string; description: string; status: TaskStatus }>): Task {
    const task = this.getById(id);
    Object.assign(task, dto);
    return task;
  }

  remove(id: string): void {
    this.getById(id);
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  create(dto: { title: string; description: string; status?: TaskStatus }): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
}
