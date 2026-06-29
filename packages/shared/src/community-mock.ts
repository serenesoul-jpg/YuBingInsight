/** 社区种子数据（Phase 2B 前客户端展示，后续接 API） */
export interface CommunityPostDto {
  id: string
  topic: string
  title: string
  excerpt: string
  author: string
  isOfficial?: boolean
  likeCount: number
  commentCount: number
  createdAt: string
}

export const COMMUNITY_TOPICS = [
  { key: 'ice-robot', label: '#冰块机器人' },
  { key: 'college-ai', label: '#大学生AI' },
  { key: 'prompt', label: '#Prompt' },
  { key: 'ml', label: '#机器学习' },
  { key: 'ethics', label: '#AI伦理' },
  { key: 'practice', label: '#实践动态' },
] as const

export const COMMUNITY_POSTS: CommunityPostDto[] = [
  {
    id: 'p1',
    topic: 'college-ai',
    title: '学完「什么是人工智能」后的三点体会',
    excerpt: '第一次系统理解大模型和传统程序的区别，推荐新手从路径第一节开始…',
    author: '语冰小队',
    isOfficial: true,
    likeCount: 42,
    commentCount: 8,
    createdAt: '2026-06-28',
  },
  {
    id: 'p2',
    topic: 'ice-robot',
    title: '冰块机器人课堂：乡村小学实操记录',
    excerpt: '带着冰块机器人进课堂，孩子们对「会动的 AI 教具」特别感兴趣…',
    author: '实践队员',
    likeCount: 28,
    commentCount: 5,
    createdAt: '2026-06-27',
  },
  {
    id: 'p3',
    topic: 'prompt',
    title: '求助：怎样写 Prompt 让 AI 回答更简洁？',
    excerpt: '做作业时用 ChatGPT 总啰嗦，有没有好的提示词模板？',
    author: '武大同学',
    likeCount: 15,
    commentCount: 12,
    createdAt: '2026-06-26',
  },
  {
    id: 'p4',
    topic: 'ethics',
    title: '官方 · AI 伦理课上线通知',
    excerpt: '大学生 AI 路径新增「负责任使用 AI」节点，欢迎反馈学习体验。',
    author: '语冰项目组',
    isOfficial: true,
    likeCount: 56,
    commentCount: 3,
    createdAt: '2026-06-25',
  },
]
