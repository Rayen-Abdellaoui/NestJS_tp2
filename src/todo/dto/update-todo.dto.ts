import { IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { StatusEnum } from '../todo.enums'; 
import { ERROR_MESSAGES } from 'src/constraints/error.messages';

export class UpdateTodoDto {
  @IsString({ message: ERROR_MESSAGES.TITLE_REQUIRED })
  @MinLength(3, { message: ERROR_MESSAGES.TITLE_LENGTH })
  @MaxLength(10, { message: ERROR_MESSAGES.TITLE_LENGTH })
  @IsOptional() 
  name?: string;

  @IsString({ message: ERROR_MESSAGES.DESCRIPTION_REQUIRED })
  @MinLength(10, { message: ERROR_MESSAGES.DESCRIPTION_LENGTH })
  @IsOptional() 
  description?: string;

  @IsEnum(StatusEnum, { message: ERROR_MESSAGES.STATUS_INVALID })
  @IsOptional() 
  status?: StatusEnum;
}