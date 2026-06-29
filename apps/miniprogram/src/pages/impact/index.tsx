import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { API_ROUTES, SERVICE_SCENES, type SiteStatsDto, type StoryDto } from '@yubing/shared'
import { get } from '../../services/request'
import './index.scss'

const SCENE_ROUTES: Record<string, string> = {
  rural: '/pages/impact/scene-rural',
  community: '/pages/impact/scene-community',
  museum: '/pages/impact/scene-museum',
}

export default function ImpactIndex() {
  const [stats, setStats] = useState<SiteStatsDto | null>(null)
  const [stories, setStories] = useState<StoryDto[]>([])

  useEffect(() => {
    get<SiteStatsDto>(API_ROUTES.stats).then(setStats).catch(() => {})
    get<StoryDto[]>(API_ROUTES.stories).then(setStories).catch(() => {})
  }, [])

  return (
    <View className="impact-page container">
      <View className="card hero">
        <Text className="hero-title">实践成果馆</Text>
        <Text className="hero-desc">语冰实践队的真实落地成效与田野故事</Text>
      </View>

      {stats && (
        <View className="card">
          <Text className="section-title">成果数据</Text>
          <View className="stats-grid">
            <View className="stat-item">
              <Text className="stat-value">{stats.courseHours}+</Text>
              <Text className="stat-label">课时</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">{stats.mediaReports}</Text>
              <Text className="stat-label">媒体报道</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">{stats.siteCount}</Text>
              <Text className="stat-label">实践站点</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-value">{Math.round(stats.careModeRatio * 100)}%</Text>
              <Text className="stat-label">关怀模式</Text>
            </View>
          </View>
        </View>
      )}

      <View className="card">
        <Text className="section-title">场景专题</Text>
        {SERVICE_SCENES.map((scene) => (
          <View
            key={scene.key}
            className="scene-item"
            onClick={() => Taro.navigateTo({ url: SCENE_ROUTES[scene.key] })}
          >
            <Text className="scene-name">{scene.label}</Text>
            <Text className="scene-desc">查看一线实践内容 →</Text>
          </View>
        ))}
      </View>

      {stories.length > 0 && (
        <View className="card">
          <Text className="section-title">故事墙</Text>
          {stories.map((story) => (
            <View
              key={story.id}
              className="story-item"
              onClick={() => Taro.navigateTo({ url: `/pages/story/detail?id=${story.id}` })}
            >
              <Text className="story-title">{story.title}</Text>
              {story.summary && <Text className="story-summary">{story.summary}</Text>}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
