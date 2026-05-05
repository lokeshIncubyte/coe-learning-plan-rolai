import { Injectable } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.interface';

@Injectable()
export class TaskStatsService {
  constructor(private readonly tasksService: TasksService) {}

  getStats(): { total: number; open: number } {
    const all = this.tasksService.getAll();
    return {
      total: all.length,
      open: all.filter(t => t.status === TaskStatus.OPEN).length,
    };
  }
}
