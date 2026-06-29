import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './scene.scss'

export default function ImpactCommunity() {
  return (
    <View className="scene-page container">
      <View className="card hero-card">
        <Text className="scene-title">社区助老助残</Text>
        <Text className="scene-desc">关怀模式与 AI 素养通识在社区场景的落地。</Text>
      </View>
      <Button className="btn-accent action-btn" onClick={() => Taro.navigateTo({ url: '/pages/care/index' })}>
        进入关怀模式
      </Button>
    </View>
  )
}
