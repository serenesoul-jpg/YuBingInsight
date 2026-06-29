import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { COLLEGE_AI_INTRO_PATH, COURSE_MODULES } from '@yubing/shared'
import { getContinueLearning } from '../../utils/learning-storage'
import './index.scss'

export default function LearnIndex() {
  const continuing = getContinueLearning()

  return (
    <View className="learn-hub container">
      <Text className="page-title">人工智能学习</Text>
      <Text className="page-desc">选择课程体系，系统学习 AI 知识与冰块机器人实操</Text>

      {continuing && (
        <View className="card continue-bar" onClick={() => Taro.navigateTo({ url: continuing.url })}>
          <Text className="continue-text">继续：{continuing.label}</Text>
        </View>
      )}

      {COURSE_MODULES.map((m) => (
        <View
          key={m.key}
          className="card module-card"
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
          <Text className="module-title">{m.label}</Text>
          <Text className="module-sub">{m.subtitle}</Text>
          <Text className="module-go">进入模块 →</Text>
        </View>
      ))}

      <View
        className="card path-banner"
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/learn/path-detail/index?id=${COLLEGE_AI_INTRO_PATH.id}`,
          })
        }
      >
        <Text className="path-label">大学生 AI · 推荐路径</Text>
        <Text className="path-title">{COLLEGE_AI_INTRO_PATH.title}</Text>
        <Text className="path-meta">{COLLEGE_AI_INTRO_PATH.nodeCount} 个学习节点</Text>
      </View>
    </View>
  )
}
