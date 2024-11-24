import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(TodoController); // Apply only to the TodoController
  }
}