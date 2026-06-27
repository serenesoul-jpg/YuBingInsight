import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { SERVICE_SCENES } from '@yubing/shared'
import './index.scss'

const TEAM_SURVEY_PATH = '/packageTeam/pages/survey/index'

export default function Service() {
  const goScene = (key: string) => {
    Taro.navigateTo({ url: `/pages/service/${key}` })
  }

  const goTeamSurvey = () => {
    Taro.navigateTo({ url: TEAM_SURVEY_PATH })
  }

  return (
    <View className="service-page container">
      <Text className="page-title">基层赋能服务</Text>
      {SERVICE_SCENES.map((scene) => (
        <View key={scene.key} className="card service-card" onClick={() => goScene(scene.key)}>
          <Text className="service-name">{scene.label}</Text>
          <Text className="service-desc">场景工具 · 问卷 · 指南</Text>
        </View>
      ))}
      <View className="card service-card team-card" onClick={goTeamSurvey}>
        <Text className="service-name">调研探针</Text>
        <Text className="service-desc">队员问卷与素材上传（邀请码认证）</Text>
      </View>
    </View>
  )
}
