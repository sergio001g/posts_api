import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Exercise } from '../exercises/exercise.entity';
import { UserProgress } from './user-progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(UserProgress)
    private readonly progressRepository: Repository<UserProgress>,
  ) {}

  async addProgress(userId: string, dto: CreateProgressDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const exercise = await this.exerciseRepository.findOne({
      where: { id: dto.exerciseId },
    });
    if (!exercise) throw new NotFoundException('Ejercicio no encontrado');
    const progress = this.progressRepository.create({
      user,
      exercise,
      score: dto.score,
    });
    return this.progressRepository.save(progress);
  }

  listUserProgress(userId: string) {
    return this.progressRepository.find({ where: { user: { id: userId } } });
  }
}
