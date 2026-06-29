import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { COMMUNITY_POSTS, COMMUNITY_TOPICS } from '@yubing/shared'
import './index.scss'

export default function CommunityIndex() {
  const [topic, setTopic] = useState<string | null>(null)

  const posts = topic
    ? COMMUNITY_POSTS.filter((p) => p.topic === topic)
    : COMMUNITY_POSTS

  return (
    <View className="community-page container">
      <Text className="page-title">学习社区</Text>
      <Text className="page-desc">分享 AI 学习心得、提问答疑、围观实践动态</Text>

      <View className="topics">
        <View
          className={`topic-chip ${topic === null ? 'active' : ''}`}
          onClick={() => setTopic(null)}
        >
          <Text>全部</Text>
        </View>
        {COMMUNITY_TOPICS.map((t) => (
          <View
            key={t.key}
            className={`topic-chip ${topic === t.key ? 'active' : ''}`}
            onClick={() => setTopic(t.key)}
          >
            <Text>{t.label}</Text>
          </View>
        ))}
      </View>

      {posts.map((post) => (
        <View
          key={post.id}
          className="card post-card"
          onClick={() =>
            Taro.navigateTo({ url: `/pages/community/detail/index?id=${post.id}` })
          }
        >
          {post.isOfficial && <Text className="official-badge">官方</Text>}
          <Text className="post-title">{post.title}</Text>
          <Text className="post-excerpt">{post.excerpt}</Text>
          <View className="post-meta">
            <Text>{post.author}</Text>
            <Text>
              👍 {post.likeCount} · 💬 {post.commentCount}
            </Text>
          </View>
        </View>
      ))}

      <View
        className="fab"
        onClick={() => Taro.showToast({ title: '发帖功能即将上线', icon: 'none' })}
      >
        <Text>+ 发帖</Text>
      </View>
    </View>
  )
}
