import { IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  user_email: string;

  @IsNotEmpty()
  total_task: number;

  @IsNotEmpty()
  created_at: Date;

  @IsNotEmpty()
  updated_at: Date;
}
