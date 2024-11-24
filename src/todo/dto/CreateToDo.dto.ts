import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';
import { ERROR_MESSAGES } from 'src/constraints/error.messages';
import { StatusEnum } from '../todo.enums';

export class CreateTodoDto {
  @IsString({ message: ERROR_MESSAGES.TITLE_REQUIRED })
  @IsNotEmpty({ message: ERROR_MESSAGES.TITLE_REQUIRED })
  @MinLength(3, { message: ERROR_MESSAGES.TITLE_LENGTH })
  @MaxLength(10, { message: ERROR_MESSAGES.TITLE_LENGTH })
  name: string;

  @IsString({ message: ERROR_MESSAGES.DESCRIPTION_REQUIRED })
  @IsNotEmpty({ message: ERROR_MESSAGES.DESCRIPTION_REQUIRED })
  @MinLength(10, { message: ERROR_MESSAGES.DESCRIPTION_LENGTH })
  description: string;

  @IsEnum(StatusEnum, { message: ERROR_MESSAGES.STATUS_INVALID })
  status: StatusEnum;
}