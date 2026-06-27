import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { IsString } from 'class-validator';
import { Public } from '../common/decorators/metadata';
import { Roles } from '../common/decorators/metadata';
import { UserRole } from '@yubing/shared';

class VerifyInviteDto {
  @IsString()
  code!: string;
}

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Public()
  @Post('invite/verify')
  verify(@Body() dto: VerifyInviteDto) {
    return this.teamService.verifyInvite(dto.code);
  }

  @Roles(UserRole.Member, UserRole.Admin)
  @Get('survey-templates')
  templates() {
    return this.teamService.listMemberTemplates();
  }
}
