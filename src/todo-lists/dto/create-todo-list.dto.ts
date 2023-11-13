import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTodoListDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(128)
  title: string;
}
