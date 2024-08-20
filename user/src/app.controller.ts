import { Body, Controller, Get } from '@nestjs/common';
import { UserService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  createUser(createUserDto: CreateUserDto): Promise<string> {
    return this.userService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(@Payload() id: number): Promise<GetUserDto | {}> {
    return this.userService.getUserById(id);
  }

  @MessagePattern({ cmd: 'get_users' })
  getUsers(): Promise<GetUserDto[] | {}> {
    return this.userService.getUsers();
  }

  @MessagePattern({ cmd: 'update_user' })
  updateUser(
    @Payload() data: { id: number; updateUserDto: UpdateUserDto },
  ): Promise<GetUserDto | {}> {
    const { id, updateUserDto } = data;
    return this.userService.updateUser(id, updateUserDto);
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(@Payload() id: number): Promise<string | {}> {
    return this.userService.deleteUser(id);
  }

  @MessagePattern({ cmd: 'update_user_task_count' })
  updateUserTaskCount(@Payload() id: number): Promise<string | {}> {
    return this.userService.updateTaskCount(id);
  }
}
