import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { UserProgress } from './user-progress.entity';
import { Exercise } from '../exercises/exercise.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress, Exercise, User])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
