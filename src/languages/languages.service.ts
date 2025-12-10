import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  create(dto: CreateLanguageDto) {
    const lang = this.languageRepository.create(dto);
    return this.languageRepository.save(lang);
  }

  findAll() {
    return this.languageRepository.find();
  }

  findOne(id: string) {
    return this.languageRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateLanguageDto) {
    const lang = await this.languageRepository.findOne({ where: { id } });
    if (!lang) return null;
    Object.assign(lang, dto);
    return this.languageRepository.save(lang);
  }

  async remove(id: string) {
    const lang = await this.languageRepository.findOne({ where: { id } });
    if (!lang) return null;
    return this.languageRepository.remove(lang);
  }
}
