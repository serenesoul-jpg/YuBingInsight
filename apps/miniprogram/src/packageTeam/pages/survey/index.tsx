import { useEffect, useState } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { API_ROUTES, type SurveyTemplateDto, UserRole } from '@yubing/shared'
import { get, post } from '../../../services/request'
import { isInviteVerified, isLoggedIn, setInviteVerified } from '../../../stores/user'
import { updateRole } from '../../../services/auth'
import './index.scss'

export default function TeamSurvey() {
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(isInviteVerified())
  const [templates, setTemplates] = useState<SurveyTemplateDto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (verified && isLoggedIn()) {
      loadTemplates()
    }
  }, [verified])

  const loadTemplates = async () => {
    try {
      const list = await get<SurveyTemplateDto[]>(API_ROUTES.team.surveyTemplates)
      setTemplates(list.map(mapTemplate))
    } catch {
      Taro.showToast({ title: '加载模板失败', icon: 'none' })
    }
  }

  const mapTemplate = (raw: SurveyTemplateDto & { schema?: { questions?: unknown[] } }): SurveyTemplateDto => {
    if (raw.questions?.length) return raw
    const schema = raw.schema as { questions?: SurveyTemplateDto['questions'] } | undefined
    return { ...raw, questions: schema?.questions ?? [] }
  }

  const verifyCode = async () => {
    if (!code.trim()) {
      Taro.showToast({ title: '请输入邀请码', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      const result = await post<{ valid: boolean; role: UserRole }>(
        API_ROUTES.team.verifyInvite,
        { code: code.trim() },
        { skipAuth: true },
      )
      if (result.valid) {
        setInviteVerified(true)
        setVerified(true)
        if (isLoggedIn()) {
          await updateRole(result.role)
        }
        Taro.showToast({ title: '验证成功', icon: 'success' })
        if (isLoggedIn()) {
          loadTemplates()
        } else {
          Taro.showModal({
            title: '提示',
            content: '请先在「我的」页面登录后再填写队员问卷',
            showCancel: false,
          })
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '邀请码无效'
      Taro.showToast({ title: msg, icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const goSurvey = (templateId: string) => {
    Taro.navigateTo({ url: `/pages/survey/form?templateId=${templateId}` })
  }

  return (
    <View className="team-survey container">
      {!verified && (
        <View className="card">
          <Text className="page-title">队员认证</Text>
          <Text className="page-desc">请输入实践队邀请码以访问调研模板</Text>
          <Input
            className="code-input"
            value={code}
            placeholder="输入邀请码"
            onInput={(e) => setCode(e.detail.value)}
          />
          <Button className="btn-primary verify-btn" loading={loading} onClick={verifyCode}>
            验证邀请码
          </Button>
        </View>
      )}

      {verified && (
        <>
          <View className="card verified-banner">
            <Text className="verified-text">✓ 邀请码已验证</Text>
          </View>
          <Text className="section-title">调研模板</Text>
          {templates.length === 0 && (
            <View className="card">
              <Text className="empty-text">暂无可用模板，请确认已登录且角色为实践队员</Text>
            </View>
          )}
          {templates.map((tpl) => (
            <View key={tpl.id} className="card template-card" onClick={() => goSurvey(tpl.id)}>
              <Text className="template-title">{tpl.title}</Text>
              <Text className="template-scene">场景：{tpl.scene}</Text>
              {tpl.description && (
                <Text className="template-desc">{tpl.description}</Text>
              )}
            </View>
          ))}
        </>
      )}
    </View>
  )
}
