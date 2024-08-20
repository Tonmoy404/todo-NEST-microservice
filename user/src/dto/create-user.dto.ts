import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'Enter your name' })
  username: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string;
}
