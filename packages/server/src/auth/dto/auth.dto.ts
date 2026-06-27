import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@yubing/shared';

export class WechatLoginDto {
  @IsString()
  code!: string;
}

export class DevLoginDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  school?: string;
}

export class UpdateCareModeDto {
  @IsBoolean()
  careMode!: boolean;
}

export class AdminLoginDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
