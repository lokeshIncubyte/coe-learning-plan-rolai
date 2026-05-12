import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatsService } from './tasks.stats.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskStatsService: TaskStatsService,
  ) {}

  @Get()
  async getAllTasks() {
    return this.tasksService.getAll();
  }

  @Post()
  async createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get('stats')
  async getStats() {
    return this.taskStatsService.getStats();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.getById(id);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeTask(@Param('id') id: string): Promise<void> {
    await this.tasksService.remove(id);
  }
}
