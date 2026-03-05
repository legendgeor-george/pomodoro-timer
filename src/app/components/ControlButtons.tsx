'use client'

interface ControlButtonsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export default function ControlButtons({
  isRunning,
  onStart,
  onPause,
  onReset,
}: ControlButtonsProps) {
  return (
    <div className="flex gap-4">
      {/* 開始/一時停止ボタン */}
      {isRunning ? (
        <button
          onClick={onPause}
          className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-yellow-500 hover:bg-yellow-600"
        >
          一時停止
        </button>
      ) : (
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-green-500 hover:bg-green-600"
        >
          開始
        </button>
      )}

      {/* リセットボタン */}
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all bg-red-500 hover:bg-red-600"
      >
        リセット
      </button>
    </div>
  )
}
