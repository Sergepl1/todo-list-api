import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TodoList } from '../../todo-lists/entities/todo-list.entity';
import { EntityHelper } from '../../utils/entity-helper';

@Entity()
export class TodoItem extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: true })
  description?: string | null;

  @Column({ type: Boolean, nullable: true })
  isCompleted?: boolean | null;

  @ManyToOne(() => TodoList, {
    eager: true,
    onDelete: 'CASCADE',
  })
  list: TodoList | null;
}
