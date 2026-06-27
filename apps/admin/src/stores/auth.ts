import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'
import { API_ROUTES } from '@yubing/shared'

interface AdminInfo {
  id: string
  username: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const admin = ref<AdminInfo | null>(
    JSON.parse(localStorage.getItem('admin_info') || 'null'),
  )

  const isLoggedIn = computed(() => !!token.value)

  function setSession(newToken: string, info: AdminInfo) {
    token.value = newToken
    admin.value = info
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_info', JSON.stringify(info))
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`
  }

  function logout() {
    token.value = null
    admin.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    delete api.defaults.headers.common.Authorization
  }

  async function login(username: string, password: string) {
    const res = await api.post(API_ROUTES.admin.login, { username, password })
    const { token: t, admin: info } = res.data.data
    setSession(t, info)
  }

  if (token.value) {
    api.defaults.headers.common.Authorization = `Bearer ${token.value}`
  }

  return { token, admin, isLoggedIn, login, logout, setSession }
})
