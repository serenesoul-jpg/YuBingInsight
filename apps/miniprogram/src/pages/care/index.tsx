import { useState } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { updateCareMode } from '../../services/auth'
import { getCareMode, isLoggedIn, setCareModeLocal } from '../../stores/user'
import './index.scss'

const logoIcon = require('../../assets/logo/icon.png')

export default function CareMode() {
  const [careMode, setCareMode] = useState(getCareMode())

  const toggleCareMode = async (enabled: boolean) => {
    try {
      if (isLoggedIn()) {
        await updateCareMode(enabled)
      } else {
        setCareModeLocal(enabled)
      }
      setCareMode(enabled)
      Taro.eventCenter.trigger('careModeChanged')
      Taro.showToast({
        title: enabled ? '已开启关怀模式' : '已关闭关怀模式',
        icon: 'success',
      })
    } catch {
      Taro.showToast({ title: '设置失败', icon: 'none' })
    }
  }

  const goHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const goLearn = () => {
    Taro.switchTab({ url: '/pages/learn/index' })
  }

  const goCommunity = () => {
    Taro.navigateTo({ url: '/pages/service/community' })
  }

  return (
    <View className="care-page container">
      <View className="care-header card">
        <Image className="care-logo" src={logoIcon} mode="aspectFit" />
        <Text className="care-title">关怀模式</Text>
        <Text className="care-desc">大按钮 · 高对比 · 单屏单任务</Text>
      </View>

      <Button className="care-btn primary" onClick={goLearn}>
        我要学习
      </Button>
      <Button className="care-btn accent" onClick={goCommunity}>
        社区助老服务
      </Button>
      <Button className="care-btn primary" onClick={goHome}>
        返回首页
      </Button>

      <View className="card toggle-card">
        <Text className="toggle-label">
          {careMode ? '关怀模式已开启' : '关怀模式已关闭'}
        </Text>
        <Button
          className="care-btn toggle"
          onClick={() => toggleCareMode(!careMode)}
        >
          {careMode ? '切换为标准模式' : '切换为关怀模式'}
        </Button>
      </View>
    </View>
  )
}
