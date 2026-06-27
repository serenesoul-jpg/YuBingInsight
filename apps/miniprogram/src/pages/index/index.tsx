import { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { API_ROUTES, BRAND_COLORS, SERVICE_SCENES, type SiteStatsDto, type StoryDto } from '@yubing/shared'
import { get } from '../../services/request'
import './index.scss'

const logoFull = require('../../assets/logo/full.png')

const SCENE_ROUTES: Record<string, string> = {
  rural: '/pages/service/rural',
  community: '/pages/service/community',
  museum: '/pages/service/museum',
}

export default function Index() {
  const [stats, setStats] = useState<SiteStatsDto | null>(null)
  const [stories, setStories] = useState<StoryDto[]>([])

  useEffect(() => {
    get<SiteStatsDto>(API_ROUTES.stats)
      .then(setStats)
      .catch(() => {})
    get<StoryDto[]>(API_ROUTES.stories)
      .then(setStories)
      .catch(() => {})
  }, [])

  const goScene = (key: string) => {
    const url = SCENE_ROUTES[key]
    if (url) Taro.navigateTo({ url })
  }

  const goCareMode = () => {
    Taro.navigateTo({ url: '/pages/care/index' })
  }

  const goStory = (id: string) => {
    Taro.navigateTo({ url: `/pages/story/detail?id=${id}` })
  }

  return (
    <View className="index-page container">
      <View className="hero card">
        <Image className="brand-logo" src={logoFull} mode="widthFix" />
        <Text className="brand-subtitle">让 AI 既有登高的硬度，也有温暖民心的温度</Text>
      </View>

      {stats && (
        <View className="card stats-card">
          <Text className="section-title">项目成果</Text>
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
        <Text className="section-title">三大场景</Text>
        <View className="scene-list">
          {SERVICE_SCENES.map((scene) => (
            <View key={scene.key} className="scene-item" onClick={() => goScene(scene.key)}>
              <Text className="scene-name">{scene.label}</Text>
              <Text className="scene-desc">点击进入场景服务</Text>
            </View>
          ))}
        </View>
      </View>

      {stories.length > 0 && (
        <View className="card">
          <Text className="section-title">故事墙</Text>
          {stories.slice(0, 5).map((story) => (
            <View key={story.id} className="story-item" onClick={() => goStory(story.id)}>
              <Text className="story-title">{story.title}</Text>
              {story.summary && <Text className="story-summary">{story.summary}</Text>}
            </View>
          ))}
        </View>
      )}

      <View
        className="care-banner"
        style={{ borderColor: BRAND_COLORS.warmOrange }}
        onClick={goCareMode}
      >
        <Text className="care-text">长辈模式 · 一键切换关怀体验</Text>
      </View>
    </View>
  )
}
