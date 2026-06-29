/** 大学生 AI 首期学习路径（PRD v2.2 §3.2，8 节点） */
export type PathNodeType = 'lesson' | 'reading' | 'quiz' | 'survey'

export interface LearningPathNodeDto {
  id: string
  sortOrder: number
  type: PathNodeType
  title: string
  description?: string
  courseCategory?: string
}

export interface LearningPathDto {
  id: string
  module: 'college-ai'
  title: string
  description: string
  nodeCount: number
  nodes: LearningPathNodeDto[]
}

export const COLLEGE_AI_INTRO_PATH: LearningPathDto = {
  id: 'path-college-ai-intro',
  module: 'college-ai',
  title: 'AI 通识入门',
  description: '面向高校学生的 AI 通识路径：概念、应用、Prompt 与伦理。',
  nodeCount: 8,
  nodes: [
    {
      id: 'n1',
      sortOrder: 1,
      type: 'lesson',
      title: '什么是人工智能',
      description: '视频 · 建立 AI 基本直觉',
      courseCategory: 'literacy',
    },
    {
      id: 'n2',
      sortOrder: 2,
      type: 'reading',
      title: 'AI 在你身边的 10 个例子',
      description: '图文 · 生活场景中的 AI',
      courseCategory: 'literacy',
    },
    {
      id: 'n3',
      sortOrder: 3,
      type: 'lesson',
      title: '大模型能做什么、不能做什么',
      description: '视频 · 能力边界与误区',
      courseCategory: 'literacy',
    },
    {
      id: 'n4',
      sortOrder: 4,
      type: 'reading',
      title: 'Prompt 入门：写好第一条指令',
      description: '图文 · 实操练习',
      courseCategory: 'literacy',
    },
    {
      id: 'n5',
      sortOrder: 5,
      type: 'lesson',
      title: '常用 AI 工具上手',
      description: '视频 · 演示录屏',
      courseCategory: 'luoen',
    },
    {
      id: 'n6',
      sortOrder: 6,
      type: 'quiz',
      title: '章节自测',
      description: '5 道选择题 · 巩固理解',
    },
    {
      id: 'n7',
      sortOrder: 7,
      type: 'lesson',
      title: 'AI 伦理与负责任使用',
      description: '视频/图文 · 偏见、隐私与公平',
      courseCategory: 'literacy',
    },
    {
      id: 'n8',
      sortOrder: 8,
      type: 'survey',
      title: '路径学习前后测',
      description: '问卷 · 帮助改进课程',
    },
  ],
}

export const LEARNING_PATHS: LearningPathDto[] = [COLLEGE_AI_INTRO_PATH]
