import { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  Input,
  Textarea,
  Switch,
  Slider,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
} from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import {
  API_ROUTES,
  type SurveyQuestion,
  type SurveyTemplateDto,
} from '@yubing/shared'
import { get, post } from '../../services/request'
import { syncSurveyDrafts } from '../../services/sync'
import {
  enqueueForSync,
  generateDraftId,
  getSurveyDraft,
  getSurveyDraftByTemplate,
  saveSurveyDraft,
} from '../../utils/storage'

export default function SurveyForm() {
  const router = useRouter()
  const templateIdParam = router.params.templateId
  const sceneParam = router.params.scene
  const draftIdParam = router.params.draftId

  const [template, setTemplate] = useState<SurveyTemplateDto | null>(null)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [anonymous, setAnonymous] = useState(true)
  const [draftId, setDraftId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        let tpl: SurveyTemplateDto | null = null

        if (templateIdParam) {
          tpl = await get<SurveyTemplateDto>(API_ROUTES.surveyDetail(templateIdParam))
        } else if (sceneParam) {
          const list = await get<SurveyTemplateDto[]>(API_ROUTES.surveys, { scene: sceneParam })
          tpl = list[0] ?? null
        }

        if (!tpl) {
          Taro.showToast({ title: '未找到问卷', icon: 'none' })
          return
        }

        setTemplate(tpl)

        const existingDraft =
          (draftIdParam && getSurveyDraft(draftIdParam)) ||
          getSurveyDraftByTemplate(tpl.id)

        if (existingDraft) {
          setDraftId(existingDraft.draftId)
          setAnswers(existingDraft.answers)
          setAnonymous(existingDraft.anonymous)
        } else {
          setDraftId(generateDraftId())
        }
      } catch {
        Taro.showToast({ title: '问卷加载失败', icon: 'none' })
      }
    }
    load()
  }, [templateIdParam, sceneParam, draftIdParam])

  const setAnswer = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const saveDraft = () => {
    if (!template) return
    saveSurveyDraft({
      draftId,
      templateId: template.id,
      scene: template.scene,
      title: template.title,
      answers,
      anonymous,
      updatedAt: new Date().toISOString(),
    })
    Taro.showToast({ title: '草稿已保存', icon: 'success' })
  }

  const validate = (): boolean => {
    if (!template) return false
    for (const q of template.questions) {
      if (!q.required) continue
      const val = answers[q.id]
      if (val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
        Taro.showToast({ title: `请填写：${q.title}`, icon: 'none' })
        return false
      }
    }
    return true
  }

  const submitOnline = async () => {
    if (!template || !validate()) return
    setSubmitting(true)
    try {
      await post(API_ROUTES.surveySubmit(template.id), {
        answers,
        anonymous,
        draftId,
      })
      Taro.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1500)
    } catch {
      saveSurveyDraft({
        draftId,
        templateId: template.id,
        scene: template.scene,
        title: template.title,
        answers,
        anonymous,
        updatedAt: new Date().toISOString(),
      })
      enqueueForSync(draftId)
      Taro.showToast({ title: '已离线保存，联网后自动同步', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const syncDrafts = async () => {
    try {
      const result = await syncSurveyDrafts()
      Taro.showToast({
        title: result.synced > 0 ? `已同步 ${result.synced} 份` : '暂无待同步草稿',
        icon: result.synced > 0 ? 'success' : 'none',
      })
    } catch {
      Taro.showToast({ title: '同步失败，请检查网络', icon: 'none' })
    }
  }

  const renderQuestion = (q: SurveyQuestion) => {
    switch (q.type) {
      case 'text':
        return (
          <Textarea
            className="question-input"
            value={(answers[q.id] as string) ?? ''}
            placeholder="请输入"
            onInput={(e) => setAnswer(q.id, e.detail.value)}
          />
        )
      case 'single':
        return (
          <RadioGroup
            onChange={(e) => setAnswer(q.id, e.detail.value)}
          >
            {(q.options ?? []).map((opt) => (
              <View key={opt} className="option-row">
                <Radio value={opt} checked={answers[q.id] === opt} color="#004EA2">
                  {opt}
                </Radio>
              </View>
            ))}
          </RadioGroup>
        )
      case 'multiple':
        return (
          <CheckboxGroup
            onChange={(e) => setAnswer(q.id, e.detail.value)}
          >
            {(q.options ?? []).map((opt) => (
              <View key={opt} className="option-row">
                <Checkbox
                  value={opt}
                  checked={((answers[q.id] as string[]) ?? []).includes(opt)}
                  color="#004EA2"
                >
                  {opt}
                </Checkbox>
              </View>
            ))}
          </CheckboxGroup>
        )
      case 'scale':
        return (
          <View className="scale-row">
            <Text className="scale-label">{q.min ?? 1}</Text>
            <Slider
              min={q.min ?? 1}
              max={q.max ?? 5}
              step={1}
              value={(answers[q.id] as number) ?? q.min ?? 1}
              activeColor="#004EA2"
              blockColor="#F5A623"
              showValue
              onChange={(e) => setAnswer(q.id, e.detail.value)}
            />
            <Text className="scale-label">{q.max ?? 5}</Text>
          </View>
        )
      default:
        return (
          <Input
            className="question-input"
            value={(answers[q.id] as string) ?? ''}
            onInput={(e) => setAnswer(q.id, e.detail.value)}
          />
        )
    }
  }

  return (
    <View className="survey-form container">
      {!template && <Text className="hint">加载问卷中...</Text>}
      {template && (
        <>
          <View className="card">
            <Text className="form-title">{template.title}</Text>
            {template.description && (
              <Text className="form-desc">{template.description}</Text>
            )}
          </View>

          {template.questions.map((q) => (
            <View key={q.id} className="card question-card">
              <Text className="question-title">
                {q.title}
                {q.required && <Text className="required"> *</Text>}
              </Text>
              {renderQuestion(q)}
            </View>
          ))}

          <View className="card">
            <View className="anon-row">
              <Text>匿名提交</Text>
              <Switch
                checked={anonymous}
                color="#004EA2"
                onChange={(e) => setAnonymous(e.detail.value)}
              />
            </View>
          </View>

          <Button className="btn-primary form-btn" onClick={saveDraft}>
            保存草稿
          </Button>
          <Button
            className="btn-accent form-btn"
            loading={submitting}
            onClick={submitOnline}
          >
            提交问卷
          </Button>
          <Button className="sync-btn form-btn" onClick={syncDrafts}>
            同步离线草稿
          </Button>
        </>
      )}
    </View>
  )
}
