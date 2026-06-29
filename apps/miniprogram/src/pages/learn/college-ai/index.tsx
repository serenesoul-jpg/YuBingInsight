import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  API_ROUTES,
  COLLEGE_AI_INTRO_PATH,
  type CourseDto,
  type LearningPathDto,
} from '@yubing/shared'
import { get } from '../../../services/request'
import { setContinueLearning } from '../../../utils/learning-storage'
import './index.scss'

export default function CollegeAiModule() {
  const [paths, setPaths] = useState<LearningPathDto[]>([])
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      get<LearningPathDto[]>(`${API_ROUTES.learningPaths}?module=college-ai`),
      get<CourseDto[]>(`${API_ROUTES.courses}?module=college-ai`),
    ])
      .then(([p, c]) => {
        setPaths(p.length ? p : [COLLEGE_AI_INTRO_PATH])
        setCourses(c)
      })
      .catch(() => {
        setPaths([COLLEGE_AI_INTRO_PATH])
      })
      .finally(() => setLoading(false))
  }, [])

  const goPath = (path: LearningPathDto) => {
    setContinueLearning({
      label: `大学生 AI · ${path.title}`,
      url: `/pages/learn/path-detail/index?id=${path.id}`,
      module: 'college-ai',
    })
    Taro.navigateTo({ url: `/pages/learn/path-detail/index?id=${path.id}` })
  }

  const goDetail = (course: CourseDto) => {
    setContinueLearning({
      label: `大学生 AI · ${course.title}`,
      url: `/pages/learn/detail?id=${course.id}`,
      module: 'college-ai',
    })
    Taro.navigateTo({ url: `/pages/learn/detail?id=${course.id}` })
  }

  return (
    <View className="module-page container">
      <View className="card intro-card">
        <Text className="module-emoji">🎓</Text>
        <Text className="module-title">大学生 AI 课程体系</Text>
        <Text className="module-desc">
          面向高校的 AI 通识与进阶：概念、大模型应用、Prompt 与伦理，按学习路径系统进阶。
        </Text>
      </View>

      <Text className="section-title">学习路径</Text>
      {paths.map((path) => (
        <View key={path.id} className="card path-card" onClick={() => goPath(path)}>
          <Text className="path-name">{path.title}</Text>
          <Text className="path-desc">{path.description}</Text>
          <Text className="path-meta">{path.nodeCount} 个节点 · 点击进入</Text>
        </View>
      ))}

      <Text className="section-title">全部课程</Text>
      {loading && <Text className="hint">加载中...</Text>}
      {!loading && courses.length === 0 && (
        <View className="card">
          <Text className="hint">暂无课程</Text>
        </View>
      )}
      {courses.map((course) => (
        <View key={course.id} className="card course-card" onClick={() => goDetail(course)}>
          <Text className="course-name">{course.title}</Text>
          {course.description && <Text className="course-desc">{course.description}</Text>}
        </View>
      ))}
    </View>
  )
}
