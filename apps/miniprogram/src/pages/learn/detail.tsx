import { useEffect, useState } from 'react'
import { View, Text, Video } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { API_ROUTES, type CourseDto } from '@yubing/shared'
import { get } from '../../services/request'
import { setContinueLearning } from '../../utils/learning-storage'
import './detail.scss'

export default function LearnDetail() {
  const router = useRouter()
  const courseId = router.params.id ?? ''
  const [course, setCourse] = useState<CourseDto | null>(null)
  const [activeUnit, setActiveUnit] = useState(0)

  useEffect(() => {
    if (!courseId) return
    get<CourseDto>(API_ROUTES.courseDetail(courseId))
      .then((data) => {
        setCourse(data)
        setContinueLearning({
          label: data.title,
          url: `/pages/learn/detail?id=${data.id}`,
          module: data.module ?? undefined,
        })
      })
      .catch(() => {
        Taro.showToast({ title: '课程加载失败', icon: 'none' })
      })
  }, [courseId])

  const unit = course?.units?.[activeUnit]

  return (
    <View className="learn-detail container">
      {!course && <Text className="hint">加载中...</Text>}
      {course && (
        <>
          <View className="card">
            <Text className="course-title">{course.title}</Text>
            {course.description && <Text className="course-desc">{course.description}</Text>}
          </View>

          {course.units && course.units.length > 0 && (
            <>
              <View className="unit-tabs">
                {course.units.map((u, idx) => (
                  <View
                    key={u.id}
                    className={`unit-tab ${idx === activeUnit ? 'active' : ''}`}
                    onClick={() => setActiveUnit(idx)}
                  >
                    <Text>{idx + 1}</Text>
                  </View>
                ))}
              </View>

              {unit && (
                <View className="card unit-card">
                  <Text className="unit-title">{unit.title}</Text>
                  {unit.durationMin != null && (
                    <Text className="unit-meta">约 {unit.durationMin} 分钟</Text>
                  )}
                  {unit.videoUrl && (
                    <Video
                      className="unit-video"
                      src={unit.videoUrl}
                      controls
                      showCenterPlayBtn
                      objectFit="contain"
                    />
                  )}
                  {unit.content && <Text className="unit-content">{unit.content}</Text>}
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  )
}
