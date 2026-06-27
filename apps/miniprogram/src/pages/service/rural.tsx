import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './rural.scss'

export default function RuralService() {
  const goSurvey = () => {
    Taro.navigateTo({ url: '/pages/survey/form?scene=rural' })
  }

  return (
    <View className="scene-page container">
      <View className="card hero-card">
        <Text className="scene-title">乡村 AI 教育</Text>
        <Text className="scene-desc">
          为县域教师提供拿即用课程包、教具指南与学情反馈工具。
        </Text>
      </View>
      <View className="card">
        <Text className="section-title">服务内容</Text>
        {['编程拼图备课包', '语冰机器人教案', '乡村学情问卷', '支教申请指引'].map((item) => (
          <View key={item} className="feature-item">
            <Text>{item}</Text>
          </View>
        ))}
      </View>
      <Button className="btn-primary action-btn" onClick={goSurvey}>
        填写乡村学情问卷
      </Button>
    </View>
  )
}
