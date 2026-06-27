import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@yubing/shared';
import { ROLES_KEY } from '../decorators/metadata';
import type { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    if (!user || user.type !== 'user') {
      throw new ForbiddenException('需要用户身份');
    }
    if (!requiredRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException('角色权限不足');
    }
    return true;
  }
}
