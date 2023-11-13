import { ApiProperty } from '@nestjs/swagger';

export class GetTodoItemDto {
  @ApiProperty({ type: String, example: 2 })
  todoListId: string;
}
