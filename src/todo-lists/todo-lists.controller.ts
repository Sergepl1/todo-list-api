import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { QueryTodoDto } from './dto/query-todo-dto';
import { NullableType } from '../utils/types/nullable.type';
import { TodoList } from './entities/todo-list.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { User } from '../users/entities/user.entity';

@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Todo lists')
@Controller({
  path: 'todo-lists',
  version: '1',
})
export class TodoListsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createTodoListDto: CreateTodoListDto,
    @Request() request,
  ): Promise<TodoList> {
    const user: User = request.user;
    return this.todoListsService.create(createTodoListDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryTodoDto, @Request() request) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    const userId = +request.user.id;

    return infinityPagination(
      await this.todoListsService.findManyWithPagination(
        {
          paginationOptions: {
            page,
            limit,
          },
        },
        userId,
      ),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
    @Request() request,
  ): Promise<NullableType<TodoList>> {
    const todoList = await this.todoListsService.findOne({ id: +id });
    console.log('todoList1', todoList);
    if (todoList?.user?.id !== request.user.id) {
      throw new ForbiddenException(
        'This user do not have permission to access this resource',
      );
    }
    return todoList;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Request() request,
  ): Promise<DeleteResult> {
    const todoList = await this.todoListsService.findOne({ id: +id });
    if (todoList?.user?.id !== request.user.id) {
      throw new ForbiddenException(
        'This user do not have permission to access this resource',
      );
    }
    return this.todoListsService.delete(+id);
  }
}
