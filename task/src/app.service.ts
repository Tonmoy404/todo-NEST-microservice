import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  async createTask(task: CreateTaskDto) {
    try {
      const newTask = await this.taskRepo.create(task);
      const result = await this.taskRepo.save(newTask);

      return `New Task Added -> ${result.title}`;
    } catch (err) {
      throw new InternalServerErrorException('An error occurred -> ', err);
    }
  }

  async getTaskById(id: number) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        return {
          message: 'No Task Was Found',
        };
      }

      return task;
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }

  async getTasks() {
    try {
      const tasks = await this.taskRepo.find();
      if (tasks.length == 0) {
        return { message: 'task list is empty' };
      }

      return tasks;
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        return { message: 'No task found' };
      }

      Object.assign(task, updateTaskDto);
      const result = await this.taskRepo.save(task);

      return result;
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }

  async deleteTask(id: number) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        return { message: 'No task found' };
      }

      await this.taskRepo.remove(task);
      return 'task deleted successfully';
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) {
        return { message: 'No task was found' };
      }

      const updateStatus = {
        ...task,
        isFinished: status,
      };

      Object.assign(task, updateStatus);
      const result = await this.taskRepo.save(task);

      return result;
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }
}
