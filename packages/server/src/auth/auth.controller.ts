import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  DevLoginDto,
  UpdateCareModeDto,
  UpdateRoleDto,
  WechatLoginDto,
} from './dto/auth.dto';
import { Public } from '../common/decorators/metadata';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/types/jwt-payload';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('wechat/login')
  wechatLogin(@Body() dto: WechatLoginDto) {
    return this.authService.wechatLogin(dto);
  }

  @Public()
  @Post('dev/login')
  devLogin(@Body() dto: DevLoginDto) {
    return this.authService.devLogin(dto);
  }

  @Get('profile')
  profile(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user.sub);
  }

  @Patch('role')
  updateRole(@CurrentUser() user: JwtPayload, @Body() dto: UpdateRoleDto) {
    return this.authService.updateRole(user.sub, dto);
  }

  @Patch('care-mode')
  updateCareMode(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCareModeDto,
  ) {
    return this.authService.updateCareMode(user.sub, dto);
  }
}
