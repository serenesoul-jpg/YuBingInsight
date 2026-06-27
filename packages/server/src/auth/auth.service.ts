import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@yubing/shared';
import {
  DevLoginDto,
  UpdateCareModeDto,
  UpdateRoleDto,
  WechatLoginDto,
} from './dto/auth.dto';
import type { JwtPayload } from '../common/types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async wechatLogin(dto: WechatLoginDto) {
    const appId = this.config.get('WECHAT_APPID');
    const secret = this.config.get('WECHAT_SECRET');

    if (!appId || !secret) {
      throw new BadRequestException(
        '微信登录未配置，开发环境请使用 /auth/dev/login',
      );
    }

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${dto.code}&grant_type=authorization_code`;
    const res = await fetch(url);
    const data = (await res.json()) as {
      openid?: string;
      errcode?: number;
      errmsg?: string;
    };

    if (!data.openid) {
      throw new UnauthorizedException(data.errmsg || '微信登录失败');
    }

    return this.loginByOpenid(data.openid);
  }

  async devLogin(dto: DevLoginDto) {
    const openid = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user = await this.prisma.user.create({
      data: {
        openid,
        nickname: dto.nickname ?? '开发用户',
        role: (dto.role as UserRole) ?? UserRole.Parent,
      },
    });
    return this.signUserToken(user);
  }

  private async loginByOpenid(openid: string) {
    let user = await this.prisma.user.findUnique({ where: { openid } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { openid, nickname: '语冰用户' },
      });
    }
    return this.signUserToken(user);
  }

  private signUserToken(user: {
    id: string;
    role: string;
    nickname: string | null;
    careMode: boolean;
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      type: 'user',
      role: user.role,
    };
    const token = this.jwt.sign(payload);
    return {
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        role: user.role,
        careMode: user.careMode,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      nickname: user.nickname,
      role: user.role,
      careMode: user.careMode,
      region: user.region,
      school: user.school,
    };
  }

  async updateRole(userId: string, dto: UpdateRoleDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: dto.role,
        region: dto.region,
        school: dto.school,
      },
    });
    return {
      id: user.id,
      nickname: user.nickname,
      role: user.role,
      careMode: user.careMode,
    };
  }

  async updateCareMode(userId: string, dto: UpdateCareModeDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { careMode: dto.careMode },
    });
    return { careMode: user.careMode };
  }
}
