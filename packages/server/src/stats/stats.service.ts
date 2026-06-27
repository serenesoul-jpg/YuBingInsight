import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getPublicStats() {
    const stats = await this.prisma.siteStat.findMany();
    const map = Object.fromEntries(stats.map((s) => [s.key, s.value]));

    const userCount = await this.prisma.user.count();
    const careCount = await this.prisma.user.count({ where: { careMode: true } });

    return {
      courseHours: map.course_hours ?? 200,
      mediaReports: map.media_reports ?? 14,
      surveyCount: map.survey_count ?? 0,
      siteCount: map.site_count ?? 6,
      careModeRatio: userCount > 0 ? careCount / userCount : 0,
    };
  }

  async getDashboard() {
    const stats = await this.getPublicStats();
    const userCount = await this.prisma.user.count();
    const courseCount = await this.prisma.course.count();
    const recentSubmissions = await this.prisma.surveySubmission.count({
      where: {
        syncedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    return {
      stats,
      userCount,
      courseCount,
      recentSubmissions,
    };
  }
}
