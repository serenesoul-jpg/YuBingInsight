import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitSurveyDto, SyncSurveysDto } from './dto/survey.dto';

@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) {}

  async listPublished(scene?: string) {
    const templates = await this.prisma.surveyTemplate.findMany({
      where: {
        published: true,
        ...(scene ? { scene } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    return templates.map((t) => this.mapTemplate(t));
  }

  async getDetail(id: string) {
    const t = await this.prisma.surveyTemplate.findFirst({
      where: { id, published: true },
    });
    if (!t) throw new NotFoundException('问卷不存在');
    return this.mapTemplate(t);
  }

  private mapTemplate(t: {
    id: string;
    title: string;
    scene: string;
    description: string | null;
    schema: unknown;
    published: boolean;
  }) {
    const schema = t.schema as { questions?: unknown[] };
    return {
      id: t.id,
      title: t.title,
      scene: t.scene,
      description: t.description,
      questions: schema?.questions ?? [],
      published: t.published,
    };
  }

  async submit(
    templateId: string,
    userId: string | undefined,
    dto: SubmitSurveyDto,
  ) {
    const template = await this.prisma.surveyTemplate.findFirst({
      where: { id: templateId, published: true },
    });
    if (!template) throw new NotFoundException('问卷不存在');

    if (dto.draftId) {
      const existing = await this.prisma.surveySubmission.findUnique({
        where: { draftId: dto.draftId },
      });
      if (existing) return existing;
    }

    return this.prisma.surveySubmission.create({
      data: {
        templateId,
        userId: dto.anonymous ? null : userId,
        answers: dto.answers as Prisma.InputJsonValue,
        anonymous: dto.anonymous ?? true,
        draftId: dto.draftId,
      },
    });
  }

  async sync(userId: string | undefined, dto: SyncSurveysDto) {
    const results = [];
    for (const item of dto.submissions) {
      results.push(
        await this.submit(item.templateId, userId, {
          answers: item.answers,
          anonymous: item.anonymous,
          draftId: item.draftId,
        }),
      );
    }
    return { synced: results.length, items: results };
  }

  async adminList() {
    return this.prisma.surveyTemplate.findMany({
      include: { submissions: { take: 5, orderBy: { syncedAt: 'desc' } } },
    });
  }

  async adminSubmissions(templateId?: string) {
    return this.prisma.surveySubmission.findMany({
      where: templateId ? { templateId } : undefined,
      orderBy: { syncedAt: 'desc' },
      include: { template: { select: { title: true, scene: true } } },
    });
  }

  async exportSubmissions(templateId?: string) {
    const rows = await this.adminSubmissions(templateId);
    return rows.map((r) => ({
      id: r.id,
      templateTitle: r.template.title,
      scene: r.template.scene,
      anonymous: r.anonymous,
      answers: r.answers,
      syncedAt: r.syncedAt,
    }));
  }
}
