import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorResponse } from './utils/error.response.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const exists = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });
      if (exists) {
        throw new BadRequestException('User Already exists');
      }

      const hashedPass = await this.hashPass(createUserDto.password);

      const newUser = await this.userRepo.create({
        ...createUserDto,
        password: hashedPass,
      });

      const result = await this.userRepo.save(newUser);
      return `New User Created -> ${result.username}`;
    } catch (err) {
      ErrorResponse.handleError(err, 'while creating the user');
    }
  }

  private async hashPass(password: any) {
    const saltRounds = +process.env.SALT;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

  async getUserById(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User does not exists');
      }
      return {
        username: user.username,
        email: user.email,
        total_task: user.total_tasks,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      };
      //   return user;
    } catch (err) {
      ErrorResponse.handleError(err, 'while getting user by id');
    }
  }

  async getUsers() {
    try {
      const users = await this.userRepo.find();
      if (users.length == 0) {
        throw new NotFoundException('No User was found');
      }

      return users.map((user) => ({
        username: user.username,
        email: user.email,
        total_task: user.total_tasks,
      }));
    } catch (err) {
      ErrorResponse.handleError(err, 'while getting all users');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userToUpdate = await this.userRepo.findOne({
        where: { id },
      });

      if (!userToUpdate) {
        throw new NotFoundException('User not found');
      }

      Object.assign(userToUpdate, updateUserDto);
      const result = await this.userRepo.save(userToUpdate);
      return {
        username: result.username,
        email: result.email,
        total_task: result.total_tasks,
        created_at: result.createdAt,
        updated_at: result.updatedAt,
      };
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        return { message: 'User Not Found' };
      }

      await this.userRepo.remove(user);
      return { message: 'User Deleted Successfully' };
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }

  async updateTaskCount(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        return { message: 'User Not Found' };
      }

      const update = {
        ...user,
        total_tasks: user.total_tasks++,
      };

      Object.assign(user, update);
      await this.userRepo.save(user);
      return `Added New task for the user -> ${user.username}`;
    } catch (err) {
      throw new InternalServerErrorException('An Error Occurred -> ', err);
    }
  }
}
