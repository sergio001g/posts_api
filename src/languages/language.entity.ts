import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lesson } from '../lessons/lesson.entity';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // ej: 'en', 'es'

  @Column()
  name: string; // ej: 'English', 'Español'

  @OneToMany(() => Lesson, (lesson) => lesson.language)
  lessons: Lesson[];
}
