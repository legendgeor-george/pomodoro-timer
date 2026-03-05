'use client'

type TimerStatus = 'idle' | 'running' | 'paused'

interface ControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip?: () => void
}

export default function Controls({ status, onStart, onPause, onReset, onSkip }: ControlsProps) {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {status === 'idle' || status === 'paused' ? (
        <button
          onClick={onStart}
          className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
          aria-label="開始"
        >
          {status === 'idle' ? '開始' : '再開'}
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-8 py-3 rounded-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600 shadow-lg hover:shadow-xl transition-all"
          aria-label="一時停止"
        >
          一時停止
        </button>
      )}

      <button
        onClick={onReset}
        className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all"
        aria-label="リセット"
      >
        リセット
      </button>

      {onSkip && (
        <button
          onClick={onSkip}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all"
          aria-label="スキップ"
        >
          スキップ
        </button>
      )}
    </div>
  )
}
