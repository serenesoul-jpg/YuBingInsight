import Taro from '@tarojs/taro'

const DRAFTS_KEY = 'yubing_survey_drafts'
const SYNC_QUEUE_KEY = 'yubing_survey_sync_queue'

export interface SurveyDraft {
  draftId: string
  templateId: string
  scene?: string
  title?: string
  answers: Record<string, unknown>
  anonymous: boolean
  updatedAt: string
}

function loadDrafts(): SurveyDraft[] {
  try {
    return Taro.getStorageSync(DRAFTS_KEY) || []
  } catch {
    return []
  }
}

function saveDrafts(drafts: SurveyDraft[]) {
  Taro.setStorageSync(DRAFTS_KEY, drafts)
}

function loadSyncQueue(): string[] {
  try {
    return Taro.getStorageSync(SYNC_QUEUE_KEY) || []
  } catch {
    return []
  }
}

function saveSyncQueue(queue: string[]) {
  Taro.setStorageSync(SYNC_QUEUE_KEY, queue)
}

export function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function saveSurveyDraft(draft: SurveyDraft) {
  const drafts = loadDrafts()
  const idx = drafts.findIndex((d) => d.draftId === draft.draftId)
  const item: SurveyDraft = { ...draft, updatedAt: new Date().toISOString() }
  if (idx >= 0) {
    drafts[idx] = item
  } else {
    drafts.push(item)
  }
  saveDrafts(drafts)
}

export function getSurveyDraft(draftId: string): SurveyDraft | null {
  return loadDrafts().find((d) => d.draftId === draftId) ?? null
}

export function getSurveyDraftByTemplate(templateId: string): SurveyDraft | null {
  return loadDrafts().find((d) => d.templateId === templateId) ?? null
}

export function listSurveyDrafts(): SurveyDraft[] {
  return loadDrafts().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function removeSurveyDraft(draftId: string) {
  saveDrafts(loadDrafts().filter((d) => d.draftId !== draftId))
  clearFromSyncQueue(draftId)
}

export function enqueueForSync(draftId: string) {
  const queue = loadSyncQueue()
  if (!queue.includes(draftId)) {
    saveSyncQueue([...queue, draftId])
  }
}

export function clearFromSyncQueue(draftId: string) {
  saveSyncQueue(loadSyncQueue().filter((id) => id !== draftId))
}

export function listPendingSyncDrafts(): SurveyDraft[] {
  const queue = loadSyncQueue()
  const drafts = loadDrafts()
  return queue
    .map((id) => drafts.find((d) => d.draftId === id))
    .filter((d): d is SurveyDraft => !!d)
}
