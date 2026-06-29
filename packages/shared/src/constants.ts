/** 品牌色 */
export const BRAND_COLORS = {
  wuhanBlue: '#004EA2',
  warmOrange: '#F5A623',
} as const

/** v2.2 课程模块 */
export const COURSE_MODULES = [
  {
    key: 'ice-robot',
    label: '冰块机器人课程体系',
    subtitle: '自研教具 · AI 实操教学',
    emoji: '🤖',
  },
  {
    key: 'college-ai',
    label: '大学生 AI 课程体系',
    subtitle: '学习路径 · 视频/图文',
    emoji: '🎓',
  },
] as const

export type CourseModuleKey = (typeof COURSE_MODULES)[number]['key']

/** 旧分类 → 模块映射 */
export const CATEGORY_TO_MODULE: Record<string, CourseModuleKey> = {
  puzzle: 'ice-robot',
  robot: 'ice-robot',
  literacy: 'college-ai',
  luoen: 'college-ai',
}

export function categoriesForModule(module: CourseModuleKey): string[] {
  return Object.entries(CATEGORY_TO_MODULE)
    .filter(([, m]) => m === module)
    .map(([cat]) => cat)
}

export function moduleForCategory(category: string): CourseModuleKey | undefined {
  return CATEGORY_TO_MODULE[category]
}

/** 课程分类（后台/兼容） */
export const COURSE_CATEGORIES = [
  { key: 'puzzle', label: '编程拼图学堂', module: 'ice-robot' as const },
  { key: 'robot', label: '冰块机器人', module: 'ice-robot' as const },
  { key: 'luoen', label: '珞恩成长课堂', module: 'college-ai' as const },
  { key: 'literacy', label: 'AI 素养通识', module: 'college-ai' as const },
] as const

/** 服务场景 */
export const SERVICE_SCENES = [
  { key: 'rural', label: '乡村 AI 教育' },
  { key: 'community', label: '社区助老助残' },
  { key: 'museum', label: '文博活化' },
] as const
