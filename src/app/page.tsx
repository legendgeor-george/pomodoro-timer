'use client'

import { useState, useEffect } from 'react'
import Timer from './components/Timer'
import Controls from './components/Controls'
import SessionSelector from './components/SessionSelector'

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface TimerState {
  timeLeft: number
  isRunning: boolean
  sessionType: SessionType
  completedPomodoros: number
}

const TIME_SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
}

export default function Home() {
  const [state, setState] = useState<TimerState>({
    timeLeft: TIME_SETTINGS.work,
    isRunning: false,
    sessionType: 'work',
    completedPomodoros: 0
  })

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission()
    }
  }, [])

  // Timer logic
  useEffect(() => {
    if (!state.isRunning || state.timeLeft <= 0) return

    const interval = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          // Timer completed
          handleTimerComplete(prev)
          return {
            ...prev,
            timeLeft: 0,
            isRunning: false
          }
        }

        return {
          ...prev,
          timeLeft: prev.timeLeft - 1
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isRunning, state.timeLeft])

  const handleTimerComplete = (currentState: TimerState) => {
    // Play alarm sound
    try {
      const audio = new Audio('/alarm.mp3')
      audio.play().catch(err => console.warn('Audio playback failed:', err))
    } catch (error) {
      console.warn('Audio creation failed:', error)
    }

    // Show notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      if (currentState.sessionType === 'work') {
        new Notification('Pomodoro Completed!', {
          body: 'Time to take a break',
          icon: '/icon.png'
        })
      } else {
        new Notification('Break Time!', {
          body: 'Time to focus',
          icon: '/icon.png'
        })
      }
    }

    // Auto-transition to next session
    setTimeout(() => {
      setState(prev => {
        let nextSession: SessionType
        let newCompletedPomodoros = prev.completedPomodoros

        if (prev.sessionType === 'work') {
          newCompletedPomodoros += 1
          // After 4 pomodoros, take a long break
          if (newCompletedPomodoros >= 4) {
            nextSession = 'longBreak'
            newCompletedPomodoros = 0
          } else {
            nextSession = 'shortBreak'
          }
        } else {
          nextSession = 'work'
        }

        return {
          ...prev,
          sessionType: nextSession,
          timeLeft: TIME_SETTINGS[nextSession],
          completedPomodoros: newCompletedPomodoros
        }
      })
    }, 100)
  }

  const onStart = () => {
    setState(prev => ({ ...prev, isRunning: true }))
  }

  const onPause = () => {
    setState(prev => ({ ...prev, isRunning: false }))
  }

  const onReset = () => {
    setState(prev => ({
      ...prev,
      timeLeft: TIME_SETTINGS[prev.sessionType],
      isRunning: false
    }))
  }

  const onSelectSession = (type: SessionType) => {
    setState({
      timeLeft: TIME_SETTINGS[type],
      isRunning: false,
      sessionType: type,
      completedPomodoros: state.completedPomodoros
    })
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Pomodoro Timer
        </h1>

        <SessionSelector
          currentSession={state.sessionType}
          onSelectSession={onSelectSession}
          disabled={state.isRunning}
        />

        <Timer
          timeLeft={state.timeLeft}
          sessionType={state.sessionType}
        />

        {/* Progress indicators */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index < state.completedPomodoros
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}
            />
          ))}
        </div>

        <Controls
          isRunning={state.isRunning}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
        />
      </div>
    </main>
  )
}
