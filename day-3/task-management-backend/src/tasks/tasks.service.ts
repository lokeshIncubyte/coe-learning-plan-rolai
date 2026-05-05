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
