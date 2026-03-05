import { TimerMode } from '@/types/timer';

interface ModeSwitchProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export const ModeSwitch = ({ currentMode, onModeChange }: ModeSwitchProps) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onModeChange('work')}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          currentMode === 'work'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50'
        }`}
        aria-label="作業モードに切り替え"
      >
        作業
      </button>
      <button
        onClick={() => onModeChange('break')}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          currentMode === 'break'
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50'
        }`}
        aria-label="休憩モードに切り替え"
      >
        休憩
      </button>
    </div>
  );
};
