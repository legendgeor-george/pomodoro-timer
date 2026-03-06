'use client'

type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface SessionSelectorProps {
  currentSession: SessionType
  onSelectSession: (type: SessionType) => void
  disabled: boolean
}

export default function SessionSelector({
  currentSession,
  onSelectSession,
  disabled
}: SessionSelectorProps) {
  const sessions: { type: SessionType; label: string }[] = [
    { type: 'work', label: 'Work' },
    { type: 'shortBreak', label: 'Short Break' },
    { type: 'longBreak', label: 'Long Break' }
  ]

  return (
    <div className="flex gap-2 mb-6">
      {sessions.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onSelectSession(type)}
          disabled={disabled}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            currentSession === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
