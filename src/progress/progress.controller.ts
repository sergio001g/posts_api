import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.strategy';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  add(@Req() req: any, @Body() dto: CreateProgressDto) {
    return this.progressService.addProgress(req.user.id, dto);
  }

  @Get()
  myProgress(@Req() req: any) {
    return this.progressService.listUserProgress(req.user.id);
  }
}
