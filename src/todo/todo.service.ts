import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { CreateTodoDto } from './dto/CreateToDo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './todo.enums';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

/*  async addTodo(title: string, description: string): Promise<TodoEntity> {
    const newTodo = this.todoRepository.create({
      title,
      description,
    });
    return await this.todoRepository.save(newTodo);
  }
    */
  async addTodo(createTodoDto: CreateTodoDto, userId: string): Promise<TodoEntity> {
    const newTodo = this.todoRepository.create({ ...createTodoDto, userId });
    return await this.todoRepository.save(newTodo);
  }
  

  async updateTodo(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOneBy({ id, userId });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found or you are not authorized.`);
    }
  
    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    const todo = await this.todoRepository.findOneBy({ id, userId });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found or you are not authorized.`);
    }
  
    await this.todoRepository.softDelete(id);
  }

  async restoreTodo(id: string): Promise<void> {
    const result = await this.todoRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with id ${id} not found or not deleted`);
    }
  }
  
  async countTodosByStatus(): Promise<{ [key in StatusEnum]: number }> {
    const pendingCount = await this.todoRepository.count({ where: { status: StatusEnum.PENDING } });
    const inProgressCount = await this.todoRepository.count({ where: { status: StatusEnum.IN_PROGRESS } });
    const doneCount = await this.todoRepository.count({ where: { status: StatusEnum.COMPLETED } });

    return {
      [StatusEnum.PENDING]: pendingCount,
      [StatusEnum.IN_PROGRESS]: inProgressCount,
      [StatusEnum.COMPLETED]: doneCount,
    };
  }

  async getTodos(): Promise<TodoEntity[]> {
    return await this.todoRepository.find();
  }

  async getTodoById(id: string): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
 }

async findTodos(
    searchTerm?: string,
    status?: StatusEnum,
    page = 1,
    limit = 10,
  ): Promise<{ data: TodoEntity[], total: number }> {
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');

    if (searchTerm) {
      queryBuilder.where(
        '(todo.title LIKE :searchTerm OR todo.description LIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('todo.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}

