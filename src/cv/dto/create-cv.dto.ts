import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { IsInt, IsOptional } from 'class-validator';
import { UserEntity } from 'src/auth/entities/user.entity';
import { SkillEntity } from 'src/skill/entities/skill.entity';

export class CreateCvDto {
  @IsString()
  name: string;

  @IsString()
  firstname: string;

  @IsInt()
  age: number;

  @IsString()
  cin: string;

  @IsString()
  job: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsString()
  userId: UserEntity; 

  skills: SkillEntity[];
}
