import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import {
  API_ROUTES,
  COLLEGE_AI_INTRO_PATH,
  type CourseDto,
  type LearningPathDto,
  type LearningPathNodeDto,
} from '@yubing/shared'
import { get } from '../../../services/request'
import './index.scss'

const NODE_TYPE_LABEL: Record<string, string> = {
  lesson: '视频课',
  reading: '图文',
  quiz: '自测',
  survey: '问卷',
}

export default function PathDetail() {
  const router = useRouter()
  const pathId = router.params.id ?? COLLEGE_AI_INTRO_PATH.id
  const [path, setPath] = useState<LearningPathDto | null>(null)
  const [courses, setCourses] = useState<CourseDto[]>([])

  useEffect(() => {
    get<LearningPathDto>(API_ROUTES.learningPathDetail(pathId))
      .then(setPath)
      .catch(() => setPath(COLLEGE_AI_INTRO_PATH))
    get<CourseDto[]>(`${API_ROUTES.courses}?module=college-ai`).then(setCourses).catch(() => {})
  }, [pathId])

  const openNode = (node: LearningPathNodeDto) => {
    if (node.type === 'survey') {
      Taro.navigateTo({ url: '/pages/survey/form?scene=community' })
      return
    }
    if (node.type === 'quiz') {
      Taro.showToast({ title: '自测题即将上线', icon: 'none' })
      return
    }
    const matched =
      courses.find((c) => c.category === node.courseCategory) ?? courses[0]
    if (matched) {
      Taro.navigateTo({ url: `/pages/learn/detail?id=${matched.id}` })
    } else {
      Taro.showToast({ title: '请先上传对应课程', icon: 'none' })
    }
  }

  if (!path) {
    return (
      <View className="path-detail container">
        <Text className="hint">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="path-detail container">
      <View className="card">
        <Text className="path-title">{path.title}</Text>
        <Text className="path-desc">{path.description}</Text>
        <Text className="path-progress">共 {path.nodeCount} 个节点 · 按顺序学习</Text>
      </View>

      {path.nodes.map((node, idx) => (
        <View key={node.id} className="card node-card" onClick={() => openNode(node)}>
          <View className="node-index">
            <Text>{idx + 1}</Text>
          </View>
          <View className="node-body">
            <Text className="node-type">{NODE_TYPE_LABEL[node.type] ?? node.type}</Text>
            <Text className="node-title">{node.title}</Text>
            {node.description && <Text className="node-desc">{node.description}</Text>}
          </View>
          <Text className="node-arrow">→</Text>
        </View>
      ))}
    </View>
  )
}
