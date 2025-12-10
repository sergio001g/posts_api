import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { Lesson } from '../lessons/lesson.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async create(dto: CreateExerciseDto) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: dto.lessonId },
    });
    if (!lesson) throw new NotFoundException('Lección no encontrada');
    const exercise = this.exerciseRepository.create({
      prompt: dto.prompt,
      type: dto.type,
      answer: dto.answer,
      lesson,
    });
    return this.exerciseRepository.save(exercise);
  }

  findAll() {
    return this.exerciseRepository.find();
  }

  findOne(id: string) {
    return this.exerciseRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateExerciseDto) {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['lesson'],
    });
    if (!exercise) throw new NotFoundException('Ejercicio no encontrado');
    if (dto.lessonId) {
      const lesson = await this.lessonRepository.findOne({
        where: { id: dto.lessonId },
      });
      if (!lesson) throw new NotFoundException('Lección no encontrada');
      exercise.lesson = lesson;
    }
    Object.assign(exercise, {
      prompt: dto.prompt ?? exercise.prompt,
      type: dto.type ?? exercise.type,
      answer: dto.answer ?? exercise.answer,
    });
    return this.exerciseRepository.save(exercise);
  }

  async remove(id: string) {
    const exercise = await this.exerciseRepository.findOne({ where: { id } });
    if (!exercise) throw new NotFoundException('Ejercicio no encontrado');
    return this.exerciseRepository.remove(exercise);
  }
}
