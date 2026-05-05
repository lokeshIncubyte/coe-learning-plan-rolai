import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { Task } from './task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAll();
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto): Task {
    return this.tasksService.create(dto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getById(id);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto): Task {
    return this.tasksService.update(id, dto);
  }
}
