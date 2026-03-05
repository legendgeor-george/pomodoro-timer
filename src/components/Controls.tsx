interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const Controls = ({ isRunning, onStart, onPause, onReset }: ControlsProps) => {
  return (
    <div className="flex gap-4">
      {isRunning ? (
        <button
          onClick={onPause}
          className="px-8 py-4 rounded-lg text-xl font-bold bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
          aria-label="一時停止"
        >
          一時停止
        </button>
      ) : (
        <button
          onClick={onStart}
          className="px-8 py-4 rounded-lg text-xl font-bold bg-green-500 hover:bg-green-600 text-white transition-colors"
          aria-label="スタート"
        >
          スタート
        </button>
      )}
      <button
        onClick={onReset}
        className="px-8 py-4 rounded-lg text-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
        aria-label="リセット"
      >
        リセット
      </button>
    </div>
  );
};
