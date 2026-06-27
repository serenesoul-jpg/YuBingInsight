import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@yubing/shared';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async verifyInvite(code: string) {
    const invite = await this.prisma.inviteCode.findUnique({ where: { code } });
    if (!invite) throw new BadRequestException('邀请码无效');
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new BadRequestException('邀请码已过期');
    }
    if (invite.maxUses && invite.usedCount >= invite.maxUses) {
      throw new BadRequestException('邀请码已达使用上限');
    }

    await this.prisma.inviteCode.update({
      where: { id: invite.id },
      data: { usedCount: { increment: 1 } },
    });

    return { valid: true, role: invite.role as UserRole };
  }

  async listMemberTemplates() {
    return this.prisma.surveyTemplate.findMany({
      where: { published: true, scene: { in: ['rural', 'community', 'museum'] } },
    });
  }
}
