'use client'

interface SessionInfoProps {
  completedPomodoros: number
  totalRequired: number
}

export default function SessionInfo({ completedPomodoros, totalRequired }: SessionInfoProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-lg text-gray-700 font-medium">
        完了: {completedPomodoros} / {totalRequired} ポモドーロ
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalRequired }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${
              index < (completedPomodoros % totalRequired === 0 && completedPomodoros > 0
                ? totalRequired
                : completedPomodoros % totalRequired)
                ? 'bg-rose-500'
                : 'bg-gray-300'
            }`}
            aria-label={`ポモドーロ ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
