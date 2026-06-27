import Taro from '@tarojs/taro'
import type { UserProfile } from '@yubing/shared'

const TOKEN_KEY = 'yubing_token'
const USER_KEY = 'yubing_user'
const CARE_MODE_KEY = 'yubing_care_mode'
const INVITE_VERIFIED_KEY = 'yubing_invite_verified'

export function getToken(): string | null {
  try {
    return Taro.getStorageSync(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setToken(token: string) {
  Taro.setStorageSync(TOKEN_KEY, token)
}

export function clearToken() {
  Taro.removeStorageSync(TOKEN_KEY)
}

export function getUser(): UserProfile | null {
  try {
    return Taro.getStorageSync(USER_KEY) || null
  } catch {
    return null
  }
}

export function setUser(user: UserProfile | null) {
  if (user) {
    Taro.setStorageSync(USER_KEY, user)
    Taro.setStorageSync(CARE_MODE_KEY, user.careMode)
  } else {
    Taro.removeStorageSync(USER_KEY)
    Taro.removeStorageSync(CARE_MODE_KEY)
  }
}

export function setAuth(token: string, user: UserProfile) {
  setToken(token)
  setUser(user)
}

export function clearAuth() {
  clearToken()
  setUser(null)
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function getCareMode(): boolean {
  const user = getUser()
  if (user) return user.careMode
  try {
    return !!Taro.getStorageSync(CARE_MODE_KEY)
  } catch {
    return false
  }
}

export function setCareModeLocal(careMode: boolean) {
  Taro.setStorageSync(CARE_MODE_KEY, careMode)
  const user = getUser()
  if (user) {
    setUser({ ...user, careMode })
  }
}

export function isInviteVerified(): boolean {
  try {
    return !!Taro.getStorageSync(INVITE_VERIFIED_KEY)
  } catch {
    return false
  }
}

export function setInviteVerified(verified: boolean) {
  Taro.setStorageSync(INVITE_VERIFIED_KEY, verified)
}
