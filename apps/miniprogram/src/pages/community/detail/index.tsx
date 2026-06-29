import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { COMMUNITY_POSTS, COMMUNITY_TOPICS } from '@yubing/shared'
import './index.scss'

export default function CommunityDetail() {
  const router = useRouter()
  const post = COMMUNITY_POSTS.find((p) => p.id === router.params.id)

  if (!post) {
    return (
      <View className="community-detail container">
        <Text className="hint">帖子不存在</Text>
      </View>
    )
  }

  const topicLabel = COMMUNITY_TOPICS.find((t) => t.key === post.topic)?.label

  return (
    <View className="community-detail container">
      <View className="card">
        {topicLabel && <Text className="topic">{topicLabel}</Text>}
        <Text className="title">{post.title}</Text>
        <Text className="meta">
          {post.author} · {post.createdAt}
        </Text>
        <Text className="body">{post.excerpt}</Text>
        <Text className="body placeholder">
          （完整正文与评论将在社区 API 上线后展示，当前为 PRD v2.2 预览数据）
        </Text>
      </View>
    </View>
  )
}
