import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/metadata';
import { LearningPathsService } from './learning-paths.service';

@ApiTags('learning-paths')
@Controller('learning-paths')
export class LearningPathsController {
  constructor(private learningPathsService: LearningPathsService) {}

  @Public()
  @Get()
  list(@Query('module') module?: string) {
    return this.learningPathsService.list(module);
  }

  @Public()
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.learningPathsService.getById(id);
  }
}
