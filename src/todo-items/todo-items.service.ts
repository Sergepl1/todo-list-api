import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { TodoItem } from './entities/todo-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { TodoListsService } from '../todo-lists/todo-lists.service';

@Injectable()
export class TodoItemsService {
  constructor(
    @InjectRepository(TodoItem)
    private todoItemRepository: Repository<TodoItem>,
    @Inject(TodoListsService)
    private readonly todoListsService: TodoListsService,
  ) {}
  async create(createTodoItemDto: CreateTodoItemDto): Promise<TodoItem> {
    const todoList = await this.todoListsService.findOne({
      id: +createTodoItemDto.todoListId,
    });

    const { description, isCompleted } = createTodoItemDto;
    return this.todoItemRepository.save(
      this.todoItemRepository.create({
        description,
        isCompleted,
        list: todoList,
      }),
    );
  }

  findOne(id: number) {
    return this.todoItemRepository.findOne({ where: { id } });
  }

  findAll(listId: number) {
    return this.todoItemRepository.find({ where: { list: { id: listId } } });
  }

  update(id: number, updateTodoItemDto: DeepPartial<TodoItem>) {
    return this.todoItemRepository.save(
      this.todoItemRepository.create({
        id,
        description: updateTodoItemDto.description,
        isCompleted: updateTodoItemDto.isCompleted,
      }),
    );
  }

  remove(id: number) {
    return this.todoItemRepository.delete(id);
  }
}
