import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { UserEntity } from 'src/auth/entities/user.entity';
import { SkillEntity } from 'src/skill/entities/skill.entity';
@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres', // or 'mysql', 'mariadb', etc.
        host: 'localhost',
        port: 5432, // your DB port
        username: 'postgres',
        password: 'postgres',
        database: 'cv_db',
        entities: [Cv, UserEntity, SkillEntity], // Add UserEntity to the list here
        synchronize: true,
      }),
      TypeOrmModule.forFeature([Cv, UserEntity, SkillEntity]), // Add UserEntity here as well if you need it in this module
    ],
    providers: [CvService],
  })
  export class CvModule {}