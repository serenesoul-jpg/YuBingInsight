import { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  API_ROUTES,
  BRAND_COLORS,
  COLLEGE_AI_INTRO_PATH,
  COMMUNITY_POSTS,
  COURSE_MODULES,
  type SiteStatsDto,
  type StoryDto,
} from '@yubing/shared'
import { get } from '../../services/request'
import { getContinueLearning } from '../../utils/learning-storage'
import './index.scss'

const logoFull = require('../../assets/logo/full.png')

export default function Index() {
  const [stats, setStats] = useState<SiteStatsDto | null>(null)
  const [stories, setStories] = useState<StoryDto[]>([])
  const [continuing] = useState(getContinueLearning)

  useEffect(() => {
    get<SiteStatsDto>(API_ROUTES.stats)
      .then(setStats)
      .catch(() => {})
    get<StoryDto[]>(API_ROUTES.stories)
      .then(setStories)
      .catch(() => {})
  }, [])

  const goLearn = () => Taro.switchTab({ url: '/pages/learn/index' })
  const goCommunity = () => Taro.switchTab({ url: '/pages/community/index' })
  const goImpact = () => Taro.navigateTo({ url: '/pages/impact/index' })
  const goCareMode = () => Taro.navigateTo({ url: '/pages/care/index' })
  const goStory = (id: string) =>
    Taro.navigateTo({ url: `/pages/story/detail?id=${id}` })
  const goContinue = () => {
    if (continuing?.url) Taro.navigateTo({ url: continuing.url })
    else goLearn()
  }
  const goPath = () =>
    Taro.navigateTo({
      url: `/pages/learn/path-detail/index?id=${COLLEGE_AI_INTRO_PATH.id}`,
    })

  return (
    <View className="index-page container">
      <View className="hero card">
        <Image className="brand-logo" src={logoFull} mode="widthFix" />
        <Text className="brand-subtitle">人工智能学习 · 社区交流 · 实践成果</Text>
      </View>

      <View className="card continue-card" onClick={goContinue}>
        <Text className="section-title">继续学习</Text>
        <Text className="continue-label">
          {continuing?.label ?? `${COLLEGE_AI_INTRO_PATH.title} · 点击进入学习路径`}
        </Text>
        <Text className="continue-action">开始学习 →</Text>
      </View>

      <View className="card">
        <Text className="section-title">AI 课程体系</Text>
        <View className="module-row">
          {COURSE_MODULES.map((m) => (
            <View
              key={m.key}
              className="module-chip"
              onClick={() =>
                Taro.navigateTo({
                  url:
                    m.key === 'ice-robot'
                      ? '/pages/learn/ice-robot/index'
                      : '/pages/learn/college-ai/index',
                })
              }
            >
              <Text className="module-emoji">{m.emoji}</Text>
              <Text className="module-name">{m.label}</Text>
            </View>
          ))}
        </View>
        <View className="link-row" onClick={goPath}>
          <Text className="link-text">🎓 推荐路径：{COLLEGE_AI_INTRO_PATH.title}</Text>
        </View>
      </View>

      <View className="card">
        <View className="section-head">
          <Text className="section-title">社区精选</Text>
          <Text className="section-more" onClick={goCommunity}>
            更多
          </Text>
        </View>
        {COMMUNITY_POSTS.slice(0, 3).map((post) => (
          <View
            key={post.id}
            className="feed-item"
            onClick={() =>
              Taro.navigateTo({ url: `/pages/community/detail/index?id=${post.id}` })
            }
          >
            <Text className="feed-title">{post.title}</Text>
            <Text className="feed-excerpt">{post.excerpt}</Text>
          </View>
        ))}
      </View>

      {stats && (
        <View className="card stats-card" onClick={goImpact}>
          <View className="section-head">
            <Text className="section-title">实践成果</Text>
            <Text className="section-more">进入成果馆 →</Text>
          </View>
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

      {stories.length > 0 && (
        <View className="card">
          <Text className="section-title">最新故事</Text>
          {stories.slice(0, 2).map((story) => (
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
