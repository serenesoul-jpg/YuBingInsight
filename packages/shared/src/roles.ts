/** 用户角色（与 PRD 对齐） */
export enum UserRole {
  Parent = 'parent',
  Teacher = 'teacher',
  Elder = 'elder',
  Member = 'member',
  Admin = 'admin',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Parent]: '家长',
  [UserRole.Teacher]: '教师',
  [UserRole.Elder]: '老人',
  [UserRole.Member]: '实践队员',
  [UserRole.Admin]: '管理员',
}

export const ADMIN_ROLES = ['super_admin', 'mentor'] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]
