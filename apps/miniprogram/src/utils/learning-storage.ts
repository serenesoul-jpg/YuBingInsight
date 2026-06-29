import Taro from '@tarojs/taro'

const KEY = 'yubing_continue_learning'

export interface ContinueLearning {
  label: string
  url: string
  module?: string
}

export function getContinueLearning(): ContinueLearning | null {
  try {
    return Taro.getStorageSync(KEY) || null
  } catch {
    return null
  }
}

export function setContinueLearning(data: ContinueLearning) {
  Taro.setStorageSync(KEY, data)
}
