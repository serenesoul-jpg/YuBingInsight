import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { UpdateProgressDto } from './dto/course.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload';
import { Public, OptionalAuth } from '../common/decorators/metadata';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Public()
  @Get()
  list(@Query('category') category?: string, @Query('module') module?: string) {
    return this.coursesService.listPublished(category, module);
  }

  @OptionalAuth()
  @Get(':id')
  detail(@Param('id') id: string, @CurrentUser() user?: JwtPayload) {
    return this.coursesService.getDetail(id, user?.sub);
  }

  @Patch('units/:unitId/progress')
  updateProgress(
    @CurrentUser() user: JwtPayload,
    @Param('unitId') unitId: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.coursesService.updateUnitProgress(user.sub, unitId, dto);
  }
}
