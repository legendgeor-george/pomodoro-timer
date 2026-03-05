'use client'

import { useState, useEffect, useCallback } from 'react'
import Controls from './Controls'
import SessionInfo from './SessionInfo'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'
type TimerStatus = 'idle' | 'running' | 'paused'

interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  pomodorosUntilLongBreak: number
}

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  pomodorosUntilLongBreak: 4,
}

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_SETTINGS.workDuration)
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0)
  const [settings] = useState<TimerSettings>(DEFAULT_SETTINGS)

  // 時間表示フォーマット関数
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // アラート音再生
  const playAlarm = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.error('Audio playback failed:', error)
    }
  }, [])

  // 次のモードを決定
  const getNextMode = useCallback((): TimerMode => {
    if (mode === 'work') {
      const nextPomodoroCount = completedPomodoros + 1
      if (nextPomodoroCount % settings.pomodorosUntilLongBreak === 0) {
        return 'longBreak'
      }
      return 'shortBreak'
    }
    return 'work'
  }, [mode, completedPomodoros, settings.pomodorosUntilLongBreak])

  // モード切替
  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode)
    setStatus('idle')

    switch (newMode) {
      case 'work':
        setTimeLeft(settings.workDuration)
        break
      case 'shortBreak':
        setTimeLeft(settings.shortBreakDuration)
        break
      case 'longBreak':
        setTimeLeft(settings.longBreakDuration)
        break
    }
  }, [settings])

  // タイマーロジック
  useEffect(() => {
    if (status !== 'running' || timeLeft === 0) return

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [status, timeLeft])

  // タイマー完了時の処理
  useEffect(() => {
    if (timeLeft === 0 && status === 'running') {
      playAlarm()

      if (mode === 'work') {
        setCompletedPomodoros(prev => prev + 1)
      }

      const nextMode = getNextMode()
      switchMode(nextMode)
    }
  }, [timeLeft, status, mode, getNextMode, switchMode, playAlarm])

  // ボタンハンドラー
  const handleStart = () => {
    setStatus('running')
  }

  const handlePause = () => {
    setStatus('paused')
  }

  const handleReset = () => {
    setStatus('idle')
    switch (mode) {
      case 'work':
        setTimeLeft(settings.workDuration)
        break
      case 'shortBreak':
        setTimeLeft(settings.shortBreakDuration)
        break
      case 'longBreak':
        setTimeLeft(settings.longBreakDuration)
        break
    }
  }

  const handleSkip = () => {
    const nextMode = getNextMode()
    if (mode === 'work') {
      setCompletedPomodoros(prev => prev + 1)
    }
    switchMode(nextMode)
  }

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'bg-rose-500'
      case 'shortBreak':
        return 'bg-green-500'
      case 'longBreak':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return '作業中 🎯'
      case 'shortBreak':
        return '休憩中 ☕'
      case 'longBreak':
        return '長い休憩 🌟'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
      {/* セッション情報 */}
      <SessionInfo
        completedPomodoros={completedPomodoros}
        totalRequired={settings.pomodorosUntilLongBreak}
      />

      {/* モード表示 */}
      <div className="text-xl font-semibold text-gray-700">
        {getModeLabel()}
      </div>

      {/* タイマー表示部 */}
      <div
        className={`w-80 h-80 rounded-full ${getModeColor()} shadow-2xl flex flex-col items-center justify-center transition-all duration-300`}
      >
        <div className="text-7xl font-bold text-white">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* コントロールボタン */}
      <Controls
        status={status}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSkip={handleSkip}
      />
    </div>
  )
}
