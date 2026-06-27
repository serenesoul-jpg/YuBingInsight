import type { UserRole } from './roles'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface UserProfile {
  id: string
  nickname: string | null
  role: UserRole
  careMode: boolean
  openid?: string | null
}

export interface CourseUnitDto {
  id: string
  title: string
  content: string | null
  videoUrl: string | null
  durationMin: number | null
  sortOrder: number
  completed?: boolean
  progress?: number
}

export interface CourseDto {
  id: string
  title: string
  description: string | null
  category: string
  coverUrl: string | null
  published: boolean
  units?: CourseUnitDto[]
  unitCount?: number
}

export interface SurveyQuestion {
  id: string
  type: 'single' | 'multiple' | 'text' | 'scale'
  title: string
  required?: boolean
  options?: string[]
  min?: number
  max?: number
}

export interface SurveyTemplateDto {
  id: string
  title: string
  scene: string
  description: string | null
  questions: SurveyQuestion[]
  published: boolean
}

export interface SurveySubmissionDto {
  templateId: string
  answers: Record<string, unknown>
  anonymous?: boolean
  draftId?: string
}

export interface StoryDto {
  id: string
  title: string
  summary: string | null
  coverUrl: string | null
  content: string | null
  videoUrl: string | null
  mediaType: 'article' | 'video'
  publishedAt: string | null
}

export interface SiteStatsDto {
  courseHours: number
  mediaReports: number
  surveyCount: number
  siteCount: number
  careModeRatio: number
}

export interface DashboardDto {
  stats: SiteStatsDto
  recentSubmissions: number
  userCount: number
  courseCount: number
}
