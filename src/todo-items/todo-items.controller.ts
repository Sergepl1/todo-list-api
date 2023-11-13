import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoItemsService } from './todo-items.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { TodoItem } from './entities/todo-item.entity';
import { TodoListsService } from '../todo-lists/todo-lists.service';
import {
  TodoListGuard,
  TodoListItemIdGuard,
  TodoListParamsGuard,
} from 'src/todo-lists/todo-list.guard';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Todo items')
@Controller({
  path: 'todo-items',
  version: '1',
})
export class TodoItemsController {
  constructor(
    private readonly todoItemsService: TodoItemsService,
    private readonly todoListsService: TodoListsService,
  ) {}

  @Post()
  @UseGuards(TodoListGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTodoItemDto: CreateTodoItemDto,
    @Request() request,
  ): Promise<TodoItem> {
    const todoList = await this.todoListsService.findOne({
      id: +createTodoItemDto.todoListId,
    });
    if (todoList?.user?.id !== request.user.id) {
      throw new ForbiddenException(
        'This user do not have permission to access this resource',
      );
    }
    return this.todoItemsService.create(createTodoItemDto);
  }

  @Get(':id')
  @UseGuards(TodoListParamsGuard)
  @HttpCode(HttpStatus.OK)
  findAll(@Param('id') id: string) {
    return this.todoItemsService.findAll(+id);
  }

  @Patch(':id')
  @UseGuards(TodoListItemIdGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ) {
    return this.todoItemsService.update(+id, updateTodoItemDto);
  }

  @Delete(':id')
  @UseGuards(TodoListItemIdGuard)
  remove(@Param('id') id: string) {
    return this.todoItemsService.remove(+id);
  }
}
