import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { API_ROUTES, COURSE_CATEGORIES, type CourseDto } from '@yubing/shared'
import { get } from '../../../services/request'
import { setContinueLearning } from '../../../utils/learning-storage'
import './index.scss'

export default function IceRobotModule() {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get<CourseDto[]>(`${API_ROUTES.courses}?module=ice-robot`)
      .then(setCourses)
      .catch(() => Taro.showToast({ title: '加载失败', icon: 'none' }))
      .finally(() => setLoading(false))
  }, [])

  const goDetail = (course: CourseDto) => {
    setContinueLearning({
      label: `冰块机器人 · ${course.title}`,
      url: `/pages/learn/detail?id=${course.id}`,
      module: 'ice-robot',
    })
    Taro.navigateTo({ url: `/pages/learn/detail?id=${course.id}` })
  }

  const categoryLabel = (key: string) =>
    COURSE_CATEGORIES.find((c) => c.key === key)?.label ?? key

  return (
    <View className="module-page container">
      <View className="card intro-card">
        <Text className="module-emoji">🤖</Text>
        <Text className="module-title">冰块机器人课程体系</Text>
        <Text className="module-desc">
          语冰自研冰块机器人教具的 AI 教学课程：硬件认识、课堂实操与教学脚本。
        </Text>
      </View>

      <Text className="section-title">课程列表</Text>
      {loading && <Text className="hint">加载中...</Text>}
      {!loading && courses.length === 0 && (
        <View className="card">
          <Text className="hint">暂无课程，请在管理后台上传内容</Text>
        </View>
      )}
      {courses.map((course) => (
        <View key={course.id} className="card course-card" onClick={() => goDetail(course)}>
          <Text className="course-name">{course.title}</Text>
          <Text className="course-tag">{categoryLabel(course.category)}</Text>
          {course.description && <Text className="course-desc">{course.description}</Text>}
          {course.unitCount != null && (
            <Text className="course-meta">{course.unitCount} 课时</Text>
          )}
        </View>
      ))}
    </View>
  )
}
