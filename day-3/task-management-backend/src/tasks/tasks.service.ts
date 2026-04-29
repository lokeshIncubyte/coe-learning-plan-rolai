import { Injectable } from '@nestjs/common';
import { Task } from './task.interface';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAll(): Task[] {
    return this.tasks;
  }

  create(dto: { title: string; description: string }): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      status: 'OPEN',
    };
    this.tasks.push(task);
    return task;
  }
}
