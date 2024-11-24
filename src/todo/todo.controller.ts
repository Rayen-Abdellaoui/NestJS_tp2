import { Controller, Post, Body, Param, Put, Delete, Patch, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/CreateToDo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './todo.entity';
import { StatusEnum } from './todo.enums';
import { AuthMiddleware } from '../auth/auth.middleware';


@Controller('todos')
@UseGuards(AuthMiddleware)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}


  /*@Post()
  async addTodo(
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    return await this.todoService.addTodo(title, description);
  }
    */
  @Post()
  async addTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return await this.todoService.addTodo(createTodoDto, userId);
  }

  @Put(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return await this.todoService.updateTodo(id, updateTodoDto, userId);
  }

  @Delete(':id')
  async deleteTodo(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return await this.todoService.deleteTodo(id, userId);
  }

    @Patch(':id/restore')
  async restoreTodo(
    @Param('id') id: string,
  ) {
    await this.todoService.restoreTodo(id);
    return { message: `Todo with id ${id} has been restored` };
  }

    @Get('count-by-status')
  async countTodosByStatus() {
    return await this.todoService.countTodosByStatus();
  }

  @Get(':id')
    async getTodo(
        @Param('id') id: string,
    ) {
        return await this.todoService.getTodoById(id);
    }
    @Get()
    async findTodos(
        @Query('status') status: StatusEnum,
        @Query('searchTerm') searchTerm: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
      ): Promise<{ data: TodoEntity[], total: number }> {
        return await this.todoService.findTodos(searchTerm, status, page, limit);
      }
}