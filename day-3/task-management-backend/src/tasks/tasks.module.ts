import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatsService } from './tasks.stats.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskStatsService],
})
export class TasksModule {}
