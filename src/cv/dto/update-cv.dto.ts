import { PartialType } from '@nestjs/mapped-types';
import { CreateCvDto } from './create-cv.dto';
import { IsString, IsOptional, IsDate, IsInt } from 'class-validator';
import { SkillEntity } from 'src/skill/entities/skill.entity';
import { UserEntity } from 'src/auth/entities/user.entity';



export class UpdateCvDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  cin?: string;

  @IsOptional()
  @IsString()
  job?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  userId?: UserEntity;

  @IsOptional()
  skills?: SkillEntity[];
}
