import { API_ROUTES } from '@yubing/shared'
import type { UserProfile, UserRole } from '@yubing/shared'
import { get, patch, post } from './request'
import { getUser, setAuth, setUser } from '../stores/user'

export interface LoginResult {
  token: string
  user: UserProfile
}

export async function devLogin(nickname?: string, role?: UserRole) {
  const data = await post<LoginResult>(
    API_ROUTES.auth.devLogin,
    { nickname, role },
    { skipAuth: true },
  )
  setAuth(data.token, data.user)
  return data
}

export async function getProfile() {
  const profile = await get<UserProfile & { region?: string; school?: string }>(
    API_ROUTES.auth.profile,
  )
  setUser(profile)
  return profile
}

export async function updateRole(
  role: UserRole,
  extra?: { region?: string; school?: string },
) {
  const user = await patch<UserProfile>(API_ROUTES.auth.updateRole, { role, ...extra })
  const current = getUser()
  if (current) {
    setUser({ ...current, ...user })
  } else {
    setUser(user)
  }
  return user
}

export async function updateCareMode(careMode: boolean) {
  const result = await patch<{ careMode: boolean }>(API_ROUTES.auth.updateCareMode, {
    careMode,
  })
  const current = getUser()
  if (current) {
    setUser({ ...current, careMode: result.careMode })
  }
  return result
}
