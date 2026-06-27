import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './museum.scss'

export default function MuseumService() {
  const goSurvey = () => {
    Taro.navigateTo({ url: '/pages/survey/form?scene=museum' })
  }

  return (
    <View className="scene-page container">
      <View className="card hero-card">
        <Text className="scene-title">文博活化</Text>
        <Text className="scene-desc">AI 导览、文物故事互动与研学任务打卡。</Text>
      </View>
      <View className="card">
        <Text className="section-title">服务内容</Text>
        {['场馆 AI 导览', '文物故事互动', '研学任务卡', '打卡勋章'].map((item) => (
          <View key={item} className="feature-item">
            <Text>{item}</Text>
          </View>
        ))}
      </View>
      <Button className="btn-primary action-btn" onClick={goSurvey}>
        填写研学反馈问卷
      </Button>
    </View>
  )
}
