import { Cv } from '../../cv/entities/cv.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('skill')
export class SkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  designation: string;

  @ManyToMany(() => Cv, { cascade: ['insert', 'update'] })
  cvs: Cv[];
}