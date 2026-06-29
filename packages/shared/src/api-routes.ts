/** API 路径前缀 */
export const API_PREFIX = '/api/v1'

export const API_ROUTES = {
  health: `${API_PREFIX}/health`,
  auth: {
    wechatLogin: `${API_PREFIX}/auth/wechat/login`,
    devLogin: `${API_PREFIX}/auth/dev/login`,
    profile: `${API_PREFIX}/auth/profile`,
    updateRole: `${API_PREFIX}/auth/role`,
    updateCareMode: `${API_PREFIX}/auth/care-mode`,
  },
  courses: `${API_PREFIX}/courses`,
  learningPaths: `${API_PREFIX}/learning-paths`,
  learningPathDetail: (id: string) => `${API_PREFIX}/learning-paths/${id}`,
  courseDetail: (id: string) => `${API_PREFIX}/courses/${id}`,
  courseProgress: (id: string) => `${API_PREFIX}/courses/${id}/progress`,
  unitProgress: (unitId: string) => `${API_PREFIX}/courses/units/${unitId}/progress`,
  surveys: `${API_PREFIX}/surveys`,
  surveyDetail: (id: string) => `${API_PREFIX}/surveys/${id}`,
  surveySubmit: (id: string) => `${API_PREFIX}/surveys/${id}/submit`,
  surveySync: `${API_PREFIX}/surveys/sync`,
  stories: `${API_PREFIX}/stories`,
  storyDetail: (id: string) => `${API_PREFIX}/stories/${id}`,
  stats: `${API_PREFIX}/stats`,
  team: {
    verifyInvite: `${API_PREFIX}/team/invite/verify`,
    surveyTemplates: `${API_PREFIX}/team/survey-templates`,
  },
  admin: {
    login: `${API_PREFIX}/admin/auth/login`,
    dashboard: `${API_PREFIX}/admin/dashboard`,
    courses: `${API_PREFIX}/admin/courses`,
    surveys: `${API_PREFIX}/admin/surveys`,
    stories: `${API_PREFIX}/admin/stories`,
    users: `${API_PREFIX}/admin/users`,
    inviteCodes: `${API_PREFIX}/admin/invite-codes`,
    exportSurveys: `${API_PREFIX}/admin/surveys/export`,
  },
} as const
