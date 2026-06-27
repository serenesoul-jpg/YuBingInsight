import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SurveysService } from './surveys.service';
import { SubmitSurveyDto, SyncSurveysDto } from './dto/survey.dto';
import { Public, OptionalAuth } from '../common/decorators/metadata';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload';

@ApiTags('surveys')
@Controller('surveys')
export class SurveysController {
  constructor(private surveysService: SurveysService) {}

  @Public()
  @Get()
  list(@Query('scene') scene?: string) {
    return this.surveysService.listPublished(scene);
  }

  @Public()
  @Get(':id')
  detail(@Param('id') id: string) {
    return this.surveysService.getDetail(id);
  }

  @OptionalAuth()
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Body() dto: SubmitSurveyDto,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.surveysService.submit(id, user?.sub, dto);
  }

  @OptionalAuth()
  @Post('sync')
  sync(@Body() dto: SyncSurveysDto, @CurrentUser() user?: JwtPayload) {
    return this.surveysService.sync(user?.sub, dto);
  }
}
