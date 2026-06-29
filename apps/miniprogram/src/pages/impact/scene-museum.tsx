import { View, Text } from '@tarojs/components'
import './scene.scss'

export default function ImpactMuseum() {
  return (
    <View className="scene-page container">
      <View className="card hero-card">
        <Text className="scene-title">文博 AI 活化</Text>
        <Text className="scene-desc">AI 导览、文物故事与研学任务在文博场景的探索。</Text>
      </View>
    </View>
  )
}
