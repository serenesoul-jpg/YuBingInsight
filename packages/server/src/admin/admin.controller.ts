import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { StatsService } from '../stats/stats.service';
import { CoursesService } from '../courses/courses.service';
import { SurveysService } from '../surveys/surveys.service';
import { StoriesService } from '../stories/stories.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCourseDto,
  CreateUnitDto,
  UpdateCourseDto,
} from '../courses/dto/course.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(
    private stats: StatsService,
    private courses: CoursesService,
    private surveys: SurveysService,
    private stories: StoriesService,
    private prisma: PrismaService,
  ) {}

  @Get('dashboard')
  dashboard() {
    return this.stats.getDashboard();
  }

  @Get('courses')
  listCourses() {
    return this.courses.adminList();
  }

  @Post('courses')
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courses.adminCreate(dto);
  }

  @Patch('courses/:id')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courses.adminUpdate(id, dto);
  }

  @Delete('courses/:id')
  deleteCourse(@Param('id') id: string) {
    return this.courses.adminDelete(id);
  }

  @Post('courses/:id/units')
  addUnit(@Param('id') id: string, @Body() dto: CreateUnitDto) {
    return this.courses.adminAddUnit(id, dto);
  }

  @Get('surveys')
  listSurveys() {
    return this.surveys.adminList();
  }

  @Get('surveys/submissions')
  submissions(@Query('templateId') templateId?: string) {
    return this.surveys.adminSubmissions(templateId);
  }

  @Get('surveys/export')
  exportSurveys(@Query('templateId') templateId?: string) {
    return this.surveys.exportSubmissions(templateId);
  }

  @Get('stories')
  listStories() {
    return this.stories.adminList();
  }

  @Get('users')
  listUsers() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Get('invite-codes')
  listInviteCodes() {
    return this.prisma.inviteCode.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
