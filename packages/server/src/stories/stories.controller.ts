import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { Public } from '../common/decorators/metadata';

@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Public()
  @Get()
  list() {
    return this.storiesService.listPublished();
  }

  @Public()
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.storiesService.getDetail(id);
  }
}
