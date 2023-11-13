import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTodoItemDto {
  @ApiProperty({ example: 'milk' })
  @IsNotEmpty()
  description?: string | null;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  isCompleted?: boolean | null;
}
