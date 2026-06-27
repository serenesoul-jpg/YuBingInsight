import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async listPublished() {
    const stories = await this.prisma.story.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    });
    return stories.map((s) => this.mapStory(s));
  }

  async getDetail(id: string) {
    const story = await this.prisma.story.findFirst({
      where: { id, published: true },
    });
    if (!story) throw new NotFoundException('故事不存在');
    return this.mapStory(story);
  }

  private mapStory(s: {
    id: string;
    title: string;
    summary: string | null;
    coverUrl: string | null;
    content: string | null;
    videoUrl: string | null;
    mediaType: string;
    publishedAt: Date | null;
  }) {
    return {
      id: s.id,
      title: s.title,
      summary: s.summary,
      coverUrl: s.coverUrl,
      content: s.content,
      videoUrl: s.videoUrl,
      mediaType: s.mediaType,
      publishedAt: s.publishedAt?.toISOString() ?? null,
    };
  }

  async adminList() {
    return this.prisma.story.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
