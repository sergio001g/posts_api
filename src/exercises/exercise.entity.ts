import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lesson } from '../lessons/lesson.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prompt: string; // enunciado del ejercicio

  @Column()
  type: string; // ej: 'translate', 'match'

  @Column({ nullable: true })
  answer?: string; // respuesta esperada (opcional)

  @ManyToOne(() => Lesson, (lesson) => lesson.exercises, { eager: true })
  lesson: Lesson;
}
