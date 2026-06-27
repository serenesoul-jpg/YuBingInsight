import { createElement, PropsWithChildren, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import Taro, { useLaunch } from '@tarojs/taro'
import { getProfile } from './services/auth'
import { getCareMode, getToken } from './stores/user'
import { syncSurveyDrafts } from './services/sync'
import './app.scss'

function App({ children }: PropsWithChildren) {
  const [careMode, setCareMode] = useState(getCareMode())

  useLaunch(() => {
    if (getToken()) {
      getProfile().catch(() => {})
    }
    syncSurveyDrafts().catch(() => {})
  })

  useEffect(() => {
    const onCareModeChanged = () => setCareMode(getCareMode())
    Taro.eventCenter.on('careModeChanged', onCareModeChanged)
    return () => {
      Taro.eventCenter.off('careModeChanged', onCareModeChanged)
    }
  }, [])

  return createElement(
    View,
    { className: careMode ? 'care-mode-root' : '' },
    children,
  )
}

export default App
