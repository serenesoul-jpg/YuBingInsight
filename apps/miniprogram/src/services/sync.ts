import { API_ROUTES } from '@yubing/shared'
import { post } from './request'
import {
  clearFromSyncQueue,
  listPendingSyncDrafts,
  removeSurveyDraft,
} from '../utils/storage'

export interface SyncResult {
  synced: number
  items: unknown[]
}

export async function syncSurveyDrafts(): Promise<SyncResult> {
  const drafts = listPendingSyncDrafts()
  if (!drafts.length) {
    return { synced: 0, items: [] }
  }

  const result = await post<SyncResult>(API_ROUTES.surveySync, {
    submissions: drafts.map((draft) => ({
      templateId: draft.templateId,
      answers: draft.answers,
      anonymous: draft.anonymous,
      draftId: draft.draftId,
    })),
  })

  for (const draft of drafts) {
    clearFromSyncQueue(draft.draftId)
    removeSurveyDraft(draft.draftId)
  }

  return result
}
