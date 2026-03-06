'use client'

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface TimerProps {
  timeLeft: number
  sessionType: SessionType
}

export default function Timer({ timeLeft, sessionType }: TimerProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const isBreak = sessionType === 'shortBreak' || sessionType === 'longBreak'

  return (
    <div className="my-8">
      <div
        className={`text-8xl font-bold text-center ${
          isBreak ? 'text-green-600' : 'text-blue-600'
        }`}
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  )
}
