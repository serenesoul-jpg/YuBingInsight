import { useEffect, useState } from 'react'
import { View, Text, Video } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { API_ROUTES, type StoryDto } from '@yubing/shared'
import { get } from '../../services/request'
import './detail.scss'

export default function StoryDetail() {
  const router = useRouter()
  const storyId = router.params.id ?? ''
  const [story, setStory] = useState<StoryDto | null>(null)

  useEffect(() => {
    if (!storyId) return
    get<StoryDto>(API_ROUTES.storyDetail(storyId))
      .then(setStory)
      .catch(() => {
        Taro.showToast({ title: '故事加载失败', icon: 'none' })
      })
  }, [storyId])

  return (
    <View className="story-detail container">
      {!story && <Text className="hint">加载中...</Text>}
      {story && (
        <>
          <View className="card">
            <Text className="story-title">{story.title}</Text>
            {story.summary && <Text className="story-summary">{story.summary}</Text>}
            {story.publishedAt && (
              <Text className="story-date">{story.publishedAt.slice(0, 10)}</Text>
            )}
          </View>
          {story.mediaType === 'video' && story.videoUrl && (
            <Video
              className="story-video"
              src={story.videoUrl}
              controls
              showCenterPlayBtn
              objectFit="contain"
            />
          )}
          {story.content && (
            <View className="card">
              <Text className="story-content">{story.content}</Text>
            </View>
          )}
        </>
      )}
    </View>
  )
}
