import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Language } from '../languages/language.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async create(dto: CreateLessonDto) {
    const language = await this.languageRepository.findOne({
      where: { id: dto.languageId },
    });
    if (!language) throw new NotFoundException('Idioma no encontrado');
    const lesson = this.lessonRepository.create({ title: dto.title, language });
    return this.lessonRepository.save(lesson);
  }

  findAll() {
    return this.lessonRepository.find({ relations: ['exercises'] });
  }

  findOne(id: string) {
    return this.lessonRepository.findOne({
      where: { id },
      relations: ['exercises'],
    });
  }

  async update(id: string, dto: UpdateLessonDto) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['language'],
    });
    if (!lesson) throw new NotFoundException('Lección no encontrada');
    if (dto.languageId) {
      const language = await this.languageRepository.findOne({
        where: { id: dto.languageId },
      });
      if (!language) throw new NotFoundException('Idioma no encontrado');
      lesson.language = language;
    }
    Object.assign(lesson, { title: dto.title ?? lesson.title });
    return this.lessonRepository.save(lesson);
  }

  async remove(id: string) {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lección no encontrada');
    return this.lessonRepository.remove(lesson);
  }
}
