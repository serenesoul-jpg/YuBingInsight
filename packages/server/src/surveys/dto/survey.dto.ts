import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SubmitSurveyDto {
  @IsObject()
  answers!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsOptional()
  @IsString()
  draftId?: string;
}

export class SyncSurveyItemDto extends SubmitSurveyDto {
  @IsString()
  templateId!: string;
}

export class SyncSurveysDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncSurveyItemDto)
  submissions!: SyncSurveyItemDto[];
}

export class CreateSurveyTemplateDto {
  @IsString()
  title!: string;

  @IsString()
  scene!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  schema!: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
