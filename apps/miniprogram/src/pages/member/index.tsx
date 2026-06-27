import { useEffect, useState } from 'react'
import { View, Text, Button, Switch, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { USER_ROLE_LABELS, UserRole, type UserProfile } from '@yubing/shared'
import { devLogin, getProfile, updateCareMode, updateRole } from '../../services/auth'
import {
  getCareMode,
  getUser,
  isLoggedIn,
  setCareModeLocal,
} from '../../stores/user'
import './index.scss'

const logoIcon = require('../../assets/logo/icon.png')

const SELECTABLE_ROLES = [
  UserRole.Parent,
  UserRole.Teacher,
  UserRole.Elder,
  UserRole.Member,
]

export default function Member() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())
  const [profile, setProfile] = useState<UserProfile | null>(getUser())
  const [careMode, setCareMode] = useState(getCareMode())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loggedIn) {
      getProfile()
        .then(setProfile)
        .catch(() => {})
    }
  }, [loggedIn])

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await devLogin('语冰用户')
      setLoggedIn(true)
      setProfile(result.user)
      Taro.showToast({ title: '登录成功', icon: 'success' })
    } catch {
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSelect = async (role: UserRole) => {
    if (!loggedIn) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    try {
      const user = await updateRole(role)
      setProfile(user)
      Taro.showToast({ title: '角色已更新', icon: 'success' })
    } catch {
      Taro.showToast({ title: '更新失败', icon: 'none' })
    }
  }

  const handleCareMode = async (enabled: boolean) => {
    try {
      if (loggedIn) {
        await updateCareMode(enabled)
        setProfile(getUser())
      } else {
        setCareModeLocal(enabled)
      }
      setCareMode(enabled)
      Taro.eventCenter.trigger('careModeChanged')
    } catch {
      Taro.showToast({ title: '设置失败', icon: 'none' })
    }
  }

  const goCarePage = () => {
    Taro.navigateTo({ url: '/pages/care/index' })
  }

  const goTeamSurvey = () => {
    Taro.navigateTo({ url: '/packageTeam/pages/survey/index' })
  }

  const showTip = (title: string) => {
    Taro.showToast({ title, icon: 'none' })
  }

  return (
    <View className="member-page container">
      <View className="brand-bar card">
        <Image className="brand-icon" src={logoIcon} mode="aspectFit" />
        <Text className="brand-name">语冰 AI 普惠</Text>
      </View>

      <View className="card profile-card">
        {loggedIn && profile ? (
          <>
            <Text className="profile-title">{profile.nickname ?? '语冰用户'}</Text>
            <Text className="profile-desc">
              当前角色：{USER_ROLE_LABELS[profile.role as UserRole] ?? profile.role}
            </Text>
          </>
        ) : (
          <>
            <Text className="profile-title">微信一键登录</Text>
            <Text className="profile-desc">登录后选择角色，获取个性化服务</Text>
            <Button className="btn-primary login-btn" loading={loading} onClick={handleLogin}>
              开发环境登录
            </Button>
          </>
        )}
      </View>

      <View className="card">
        <Text className="section-title">可选角色</Text>
        {SELECTABLE_ROLES.map((role) => (
          <View
            key={role}
            className={`role-item ${profile?.role === role ? 'active' : ''}`}
            onClick={() => handleRoleSelect(role)}
          >
            <Text>{USER_ROLE_LABELS[role]}</Text>
            {profile?.role === role && <Text className="role-badge">当前</Text>}
          </View>
        ))}
      </View>

      <View className="card">
        <View className="setting-row">
          <Text className="section-title">关怀模式</Text>
          <Switch
            checked={careMode}
            color="#F5A623"
            onChange={(e) => handleCareMode(e.detail.value)}
          />
        </View>
        <Button className="link-btn" onClick={goCarePage}>
          进入关怀模式页面
        </Button>
      </View>

      <View className="card">
        <Text className="section-title">设置</Text>
        <View className="setting-link" onClick={() => showTip('隐私中心即将上线')}>
          <Text>隐私中心</Text>
        </View>
        <View className="setting-link" onClick={() => showTip('意见反馈即将上线')}>
          <Text>意见反馈</Text>
        </View>
        <View className="setting-link" onClick={() => showTip('语冰 AI 普惠 v0.1 MVP')}>
          <Text>关于语冰</Text>
        </View>
        <View className="setting-link" onClick={goTeamSurvey}>
          <Text>队员调研入口</Text>
        </View>
      </View>
    </View>
  )
}
