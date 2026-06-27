import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './community.scss'

export default function CommunityService() {
  const goSurvey = () => {
    Taro.navigateTo({ url: '/pages/survey/form?scene=community' })
  }

  const goCare = () => {
    Taro.navigateTo({ url: '/pages/care/index' })
  }

  return (
    <View className="scene-page container">
      <View className="card hero-card">
        <Text className="scene-title">社区助老助残</Text>
        <Text className="scene-desc">
          大字关怀模式、场景化设备指南与志愿者协助入口。
        </Text>
      </View>
      <View className="card">
        <Text className="section-title">服务内容</Text>
        {['关怀模式一键切换', '手机挂号分步教程', '一键呼叫志愿者', '无障碍设置'].map(
          (item) => (
            <View key={item} className="feature-item">
              <Text>{item}</Text>
            </View>
          ),
        )}
      </View>
      <Button className="btn-primary action-btn" onClick={goSurvey}>
        填写数字能力前测
      </Button>
      <Button className="btn-accent action-btn" onClick={goCare}>
        进入关怀模式
      </Button>
    </View>
  )
}
