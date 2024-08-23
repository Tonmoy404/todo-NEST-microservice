import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ErrorResponse } from './utils/error.response.util';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  async createTask(task: CreateTaskDto) {
    try {
      const newTask = await this.taskRepo.create(task);
      const result = await this.taskRepo.save(newTask);

      return result;
    } catch (err) {
      ErrorResponse.handleError(err, 'while creating task');
    }
  }

  async getTaskById(id: number) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('NO task was found');
      }
      return task;
    } catch (err) {
      ErrorResponse.handleError(err, 'while getting task by id ');
    }
  }

  async getTasks() {
    try {
      const tasks = await this.taskRepo.find();
      if (tasks.length == 0) {
        throw new NotFoundException('Task list is empty');
      }

      return tasks;
    } catch (err) {
      ErrorResponse.handleError(err, 'while getting all tasks');
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      Object.assign(task, updateTaskDto);
      const result = await this.taskRepo.save(task);

      return result;
    } catch (err) {
      ErrorResponse.handleError(err, 'while updating task');
    }
  }

  async deleteTask(id: number) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      await this.taskRepo.remove(task);
      return 'task deleted successfully';
    } catch (err) {
      ErrorResponse.handleError(err, 'while deleting task');
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      const updateStatus = {
        ...task,
        isFinished: status,
      };

      Object.assign(task, updateStatus);
      const result = await this.taskRepo.save(task);

      return result;
    } catch (err) {
      ErrorResponse.handleError(err, 'while updating task status');
    }
  }
}
