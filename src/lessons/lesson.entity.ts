import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Language } from '../languages/language.entity';
import { Exercise } from '../exercises/exercise.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Language, (language) => language.lessons, { eager: true })
  language: Language;

  @OneToMany(() => Exercise, (ex) => ex.lesson)
  exercises: Exercise[];
}
