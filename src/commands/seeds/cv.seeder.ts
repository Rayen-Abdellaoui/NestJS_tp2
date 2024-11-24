import { DataSource } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { SkillEntity } from '../../skill/entities/skill.entity';
import { Cv } from '../../cv/entities/cv.entity';
import { Generator } from './services/generator';
import { Client } from 'pg';  

async function bootstrap() {
  const dbName = 'cv_db';
  const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: 'rayen123',
  });

  
  await client.connect();

  
  const result = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
  if (result.rowCount === 0) {
    
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created successfully.`);
  } else {
    console.log(`Database ${dbName} already exists.`);
  }

  await client.end();

  
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'rayen123',
    database: dbName,
    entities: [UserEntity, SkillEntity, Cv],
    synchronize: true,  
  });

  await dataSource.initialize();

  const generator = new Generator();
  const cvsCount = 6;
  const generatedCvs = await generator.genCvs(cvsCount);

  const cvsRepository = dataSource.getRepository(Cv);
  const cvs = await cvsRepository.save(generatedCvs);
  console.log(cvs);

  await dataSource.destroy();
}

bootstrap();
