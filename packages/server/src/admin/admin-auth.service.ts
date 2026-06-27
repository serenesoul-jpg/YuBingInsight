import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from '../auth/dto/auth.dto';
import type { JwtPayload } from '../common/types/jwt-payload';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { username: dto.username },
    });
    if (!admin) throw new UnauthorizedException('用户名或密码错误');

    const ok = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!ok) throw new UnauthorizedException('用户名或密码错误');

    const payload: JwtPayload = {
      sub: admin.id,
      type: 'admin',
      role: admin.role,
    };

    return {
      token: this.jwt.sign(payload),
      admin: { id: admin.id, username: admin.username, role: admin.role },
    };
  }
}
