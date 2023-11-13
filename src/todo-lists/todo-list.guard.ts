import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { TodoItemsService } from '../todo-items/todo-items.service';

@Injectable()
export class TodoListGuard implements CanActivate {
  constructor(private readonly todoListService: TodoListsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    console.log('userId1', userId);
    const todoListId = +request.body.todoListId;

    // Check if the current user is the owner of the requested todo list
    return await this.todoListService.isTodoListOwner(userId, todoListId);
  }
}

@Injectable()
export class TodoListParamsGuard implements CanActivate {
  constructor(private readonly todoListService: TodoListsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const todoListId = +request.params.id;

    // Check if the current user is the owner of the requested todo list
    return await this.todoListService.isTodoListOwner(userId, todoListId);
  }
}

@Injectable()
export class TodoListItemIdGuard implements CanActivate {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const todoItem = await this.todoItemsService.findOne(+request.params.id);
    return todoItem?.list?.user.id === request.user.id;
  }
}
