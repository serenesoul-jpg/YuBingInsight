import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { Public } from '../common/decorators/metadata';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Public()
  @Get()
  getStats() {
    return this.statsService.getPublicStats();
  }
}
