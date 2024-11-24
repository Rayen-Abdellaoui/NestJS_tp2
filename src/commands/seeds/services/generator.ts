import {
    rand,
    randEmail,
    randFilePath,
    randFirstName,
    randJobTitle,
    randLastName,
    randNumber,
    randPassword,
    randSkill,
    randUserName,
    randUuid,
  } from '@ngneat/falso';
  import { UserEntity } from '../../../auth/entities/user.entity';
  import { genSalt, hash } from 'bcrypt';
  import { SkillEntity } from '../../../skill/entities/skill.entity'; ;
  import { Cv } from '../../../cv/entities/cv.entity'; ;
  import { DeepPartial } from 'typeorm';
  
  export class Generator {
    async genUser(): Promise<DeepPartial<UserEntity>> {
      const saltRounds = 10;
      const salt = await genSalt(saltRounds);
  
      const user: DeepPartial<UserEntity> = {
        id: randUuid(),
        username: randUserName(),
        email: randEmail(),
        password: await hash(randPassword(), salt),
        salt,
        cvs: null,
      };
  
      return user;
    }
  
    genUsers(count = 1): Promise<DeepPartial<UserEntity>[]> {
      return Promise.all(
        Array(count)
          .fill(null)
          .map(() => this.genUser()),
      );
    }
  
    genSkill(): DeepPartial<SkillEntity> {
      const skill: DeepPartial<SkillEntity> = {
        id: randUuid(),
        designation: randSkill(),
      };
  
      return skill;
    }
  
    genSkills(count = 1): DeepPartial<SkillEntity>[] {
      return Array(count)
        .fill(null)
        .map(() => this.genSkill());
    }
  
    genCvBasic(): DeepPartial<Cv> {
      const cinPartialMax = 9999;
  
      return {
        firstname: randFirstName(),
        name: randLastName(),
        cin: rand([0, 1]) + '' + randNumber({ max: cinPartialMax }),
      };
    }
  
    genCvBasicWithUser(user: DeepPartial<UserEntity>): DeepPartial<Cv> {
      return { ...this.genCvBasic(), user };
    }
  
    async genCv(): Promise<DeepPartial<Cv>> {
      const ageMin = 18;
      const ageMax = 60;
  
      const skillsMax = 3;
  
      const cv: DeepPartial<Cv> = {
        id: randUuid(),
        ...this.genCvBasic(),
        age: randNumber({ min: ageMin, max: ageMax }),
        job: randJobTitle(),
        path: randFilePath(),
        skills: this.genSkills(randNumber({ max: skillsMax })),
        user: await this.genUser(),
      };
  
      return cv;
    }
  
    private distinct<T>(arr: T[], keys: (keyof T)[]) {
      return arr.filter((value, index, array) =>
        keys.every(
          (key) => array.findIndex((val) => val[key] === value[key]) === index,
        ),
      );
    }
  
    genCvFromBasicWithUser(
      basicCv: DeepPartial<Cv>,
      availableSkills: DeepPartial<SkillEntity>[],
      maxSkillsPerCv: number,
    ): DeepPartial<Cv> {
      const ageMin = 18;
      const ageMax = 60;
  
      const skills = this.distinct(
        rand(availableSkills, {
          length: randNumber({
            max: Math.min(maxSkillsPerCv, availableSkills.length),
          }),
        }),
        ['id'],
      );
  
      const cv: DeepPartial<Cv> = {
        id: randUuid(),
        ...basicCv,
        age: randNumber({ min: ageMin, max: ageMax }),
        job: randJobTitle(),
        path: randFilePath(),
        skills,
      };
  
      return cv;
    }
  
    genCvs(count = 1): Promise<DeepPartial<Cv>[]> {
      return Promise.all(
        Array(count)
          .fill(null)
          .map(() => this.genCv()),
      );
    }
  
    async genCvsWithReuse(
      maxCvsPerUser: number,
      maxUsers: number,
      maxSkills: number,
      maxSkillsPerCv: number,
    ): Promise<DeepPartial<Cv>[]> {
      const users = this.distinct(await this.genUsers(maxUsers), [
        'id',
        'username',
        'email',
      ]);
      const skills = this.distinct(this.genSkills(maxSkills), [
        'id',
        'designation',
      ]);
  
      const cvs = this.distinct(
        users.flatMap((user) => {
          const basicCv = this.genCvBasicWithUser(user);
          const count = randNumber({ max: maxCvsPerUser });
  
          return Array(count)
            .fill(null)
            .map(() =>
              this.genCvFromBasicWithUser(basicCv, skills, maxSkillsPerCv),
            );
        }),
        ['id'],
      );
  
      return cvs;
    }
  }