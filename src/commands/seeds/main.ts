import { NestFactory } from '@nestjs/core';
import { Cv } from 'src/cv/entities/cv.entity';
import { Generator } from  'src/commands/seeds/services/generator';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const generator = new Generator();

  const maxCvsPerUser = 5;
  const maxUsers = 10;
  const maxSkills = 5;
  const maxSkillsPerCv = 4;

  const generatedCvs = await generator.genCvsWithReuse(
    maxCvsPerUser,
    maxUsers,
    maxSkills,
    maxSkillsPerCv,
  );

  const cvsRepository = app.get(getRepositoryToken(Cv));

  const cvs = await cvsRepository.save(generatedCvs);
  console.log(cvs);

  await app.close();
}
bootstrap();