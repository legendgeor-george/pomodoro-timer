'use client'

interface ControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export default function Controls({ isRunning, onStart, onPause, onReset }: ControlsProps) {
  return (
    <div className="flex gap-4 justify-center">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="px-6 py-3 bg-green-500 hover:opacity-90 rounded-lg font-semibold text-white transition-opacity"
        >
          Start
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-6 py-3 bg-yellow-500 hover:opacity-90 rounded-lg font-semibold text-white transition-opacity"
        >
          Pause
        </button>
      )}
      <button
        onClick={onReset}
        className="px-6 py-3 bg-gray-500 hover:opacity-90 rounded-lg font-semibold text-white transition-opacity"
      >
        Reset
      </button>
    </div>
  )
}
