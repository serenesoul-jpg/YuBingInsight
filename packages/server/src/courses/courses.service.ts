import { Injectable, NotFoundException } from '@nestjs/common';
import { categoriesForModule, moduleForCategory } from '@yubing/shared';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCourseDto,
  CreateUnitDto,
  UpdateCourseDto,
  UpdateProgressDto,
} from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async listPublished(category?: string, module?: string) {
    let categoryFilter: string | { in: string[] } | undefined = category
      ? category
      : undefined;
    if (module) {
      const cats = categoriesForModule(module as 'ice-robot' | 'college-ai');
      if (cats.length) categoryFilter = { in: cats };
    }
    const courses = await this.prisma.course.findMany({
      where: {
        published: true,
        ...(categoryFilter
          ? typeof categoryFilter === 'string'
            ? { category: categoryFilter }
            : { category: categoryFilter }
          : {}),
      },
      orderBy: { sortOrder: 'asc' },
      include: { units: { orderBy: { sortOrder: 'asc' } } },
    });
    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      module: moduleForCategory(c.category) ?? null,
      coverUrl: c.coverUrl,
      published: c.published,
      unitCount: c.units.length,
    }));
  }

  async getDetail(id: string, userId?: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, published: true },
      include: { units: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!course) throw new NotFoundException('课程不存在');

    let progressMap: Record<string, { completed: boolean; progress: number }> =
      {};
    if (userId) {
      const rows = await this.prisma.learningProgress.findMany({
        where: { userId, unitId: { in: course.units.map((u) => u.id) } },
      });
      progressMap = Object.fromEntries(
        rows.map((r) => [r.unitId, { completed: r.completed, progress: r.progress }]),
      );
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      module: moduleForCategory(course.category) ?? null,
      coverUrl: course.coverUrl,
      published: course.published,
      units: course.units.map((u) => ({
        id: u.id,
        title: u.title,
        content: u.content,
        videoUrl: u.videoUrl,
        durationMin: u.durationMin,
        sortOrder: u.sortOrder,
        completed: progressMap[u.id]?.completed ?? false,
        progress: progressMap[u.id]?.progress ?? 0,
      })),
    };
  }

  async updateUnitProgress(
    userId: string,
    unitId: string,
    dto: UpdateProgressDto,
  ) {
    const unit = await this.prisma.courseUnit.findUnique({ where: { id: unitId } });
    if (!unit) throw new NotFoundException('课时不存在');

    const record = await this.prisma.learningProgress.upsert({
      where: { userId_unitId: { userId, unitId } },
      create: {
        userId,
        unitId,
        completed: dto.completed ?? false,
        progress: dto.progress ?? 0,
      },
      update: {
        completed: dto.completed,
        progress: dto.progress,
      },
    });
    return record;
  }

  // Admin methods
  async adminList() {
    return this.prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { units: true },
    });
  }

  async adminCreate(dto: CreateCourseDto) {
    return this.prisma.course.create({ data: dto });
  }

  async adminUpdate(id: string, dto: UpdateCourseDto) {
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async adminDelete(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }

  async adminAddUnit(courseId: string, dto: CreateUnitDto) {
    return this.prisma.courseUnit.create({
      data: { ...dto, courseId },
    });
  }
}
