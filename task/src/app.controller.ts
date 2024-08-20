import { Controller, Get } from '@nestjs/common';
import { TaskService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller()
export class AppController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'create_task' })
  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @MessagePattern({ cmd: 'get_task' })
  getTask(@Payload() id: number): Promise<Task | {}> {
    return this.taskService.getTaskById(id);
  }

  @MessagePattern({ cmd: 'get_tasks' })
  getTasks(): Promise<Task[] | {}> {
    return this.taskService.getTasks();
  }

  @MessagePattern({ cmd: 'update_task' })
  updateTask(
    @Payload() data: { id: number; updateTaskDto: UpdateTaskDto },
  ): Promise<Task | {}> {
    const { id, updateTaskDto } = data;
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @MessagePattern({ cmd: 'delete_task' })
  deleteTask(@Payload() id: number): Promise<Task | {}> {
    return this.taskService.deleteTask(id);
  }

  @MessagePattern({ cmd: 'update_status' })
  updateStatus(
    @Payload() data: { id: number; status: string },
  ): Promise<Task | {}> {
    const { id, status } = data;
    return this.taskService.updateStatus(id, status);
  }
}
