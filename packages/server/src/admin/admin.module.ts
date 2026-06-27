import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { StatsModule } from '../stats/stats.module';
import { CoursesModule } from '../courses/courses.module';
import { SurveysModule } from '../surveys/surveys.module';
import { StoriesModule } from '../stories/stories.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    StatsModule,
    CoursesModule,
    SurveysModule,
    StoriesModule,
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminModule {}
