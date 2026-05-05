import { Injectable } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.interface';

@Injectable()
export class TaskStatsService {
  constructor(private readonly tasksService: TasksService) {}

  getStats(): { total: number; open: number } {
    const tasks = this.tasksService.getAll();
    return {
      total: tasks.length,
      open: tasks.filter(t => t.status === TaskStatus.OPEN).length,
    };
  }
}
