import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TodoList } from './entities/todo-list.entity';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { NullableType } from '../utils/types/nullable.type';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
  ) {}
  create(createTodoListDto: CreateTodoListDto, user: User): Promise<TodoList> {
    return this.todoListRepository.save(
      this.todoListRepository.create({ ...createTodoListDto, user }),
    );
  }

  findManyWithPagination(
    {
      paginationOptions,
    }: {
      paginationOptions: IPaginationOptions;
    },
    userId: number,
  ): Promise<TodoList[]> {
    const where: FindOptionsWhere<TodoList> = { user: { id: userId } };

    return this.todoListRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
    });
  }

  findOne(fields: EntityCondition<TodoList>): Promise<NullableType<TodoList>> {
    return this.todoListRepository.findOne({
      where: fields,
    });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.todoListRepository.delete(id);
  }

  async isTodoListOwner(userId: number, todoListId: number): Promise<boolean> {
    const todoList = await this.todoListRepository.findOne({
      where: { id: todoListId },
    });

    if (!todoList) {
      throw new NotFoundException('Todo list not found');
    }

    return todoList?.user?.id === userId;
  }
}
