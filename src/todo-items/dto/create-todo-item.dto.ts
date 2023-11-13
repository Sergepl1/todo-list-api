import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTodoItemDto {
  @ApiProperty({ example: 'apples' })
  @IsNotEmpty()
  description?: string | null;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  isCompleted?: boolean | null;

  @ApiProperty({ type: String, example: 1 })
  @IsNotEmpty()
  todoListId: string;
}
