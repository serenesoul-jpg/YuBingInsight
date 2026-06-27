import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { API_ROUTES, COURSE_CATEGORIES, type CourseDto } from '@yubing/shared'
import { get } from '../../services/request'
import './index.scss'

export default function Learn() {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    get<CourseDto[]>(API_ROUTES.courses)
      .then(setCourses)
      .catch(() => {
        Taro.showToast({ title: '加载课程失败', icon: 'none' })
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryLabel = (key: string) =>
    COURSE_CATEGORIES.find((c) => c.key === key)?.label ?? key

  const goDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/learn/detail?id=${id}` })
  }

  return (
    <View className="learn-page container">
      <Text className="page-title">学习内容</Text>
      {loading && <Text className="hint">加载中...</Text>}
      {!loading && courses.length === 0 && (
        <View className="card">
          <Text className="course-desc">暂无已发布课程</Text>
        </View>
      )}
      {courses.map((course) => (
        <View key={course.id} className="card course-card" onClick={() => goDetail(course.id)}>
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
