import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title can not be empty' })
  title: string;

  @IsOptional()
  @Length(3, 250)
  description: string;
}
