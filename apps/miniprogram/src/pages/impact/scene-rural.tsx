import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './scene.scss'

export default function ImpactRural() {
  return (
    <View className="scene-page container">
      <View className="card hero-card">
        <Text className="scene-title">乡村 AI 教育</Text>
        <Text className="scene-desc">冰块机器人与编程拼图走进县域课堂的实践专题。</Text>
      </View>
      <View className="card">
        <Text className="section-title">成果亮点</Text>
        {['200+ 课时沉淀', '冰块机器人教案', '乡村学情问卷', '五省六地站点'].map((item) => (
          <View key={item} className="feature-item">
            <Text>{item}</Text>
          </View>
        ))}
      </View>
      <Button
        className="btn-primary action-btn"
        onClick={() => Taro.navigateTo({ url: '/pages/survey/form?scene=rural' })}
      >
        填写乡村学情问卷
      </Button>
    </View>
  )
}
