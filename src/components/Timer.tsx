'use client';

import React from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import { ProgressCircle } from './ProgressCircle';
import { Stats } from './Stats';

const MODE_LABELS = {
  work: '作業時間',
  shortBreak: '休憩時間',
  longBreak: '長い休憩',
};

export default function Timer() {
  const { state, startTimer, pauseTimer, resetTimer, skipToNext } = usePomodoro();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTotalDuration = (): number => {
    switch (state.mode) {
      case 'work':
        return 1500;
      case 'shortBreak':
        return 300;
      case 'longBreak':
        return 900;
    }
  };

  const progress = ((getTotalDuration() - state.timeLeft) / getTotalDuration()) * 100;

  return (
    <div className="flex flex-col items-center">
      {/* Mode display */}
      <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-gray-700">
        {MODE_LABELS[state.mode]}
      </h2>

      {/* Progress circle */}
      <div className="mb-8">
        <ProgressCircle
          progress={progress}
          size={300}
          strokeWidth={12}
          timeDisplay={formatTime(state.timeLeft)}
          mode={state.mode}
        />
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 mb-4">
        {!state.isRunning ? (
          <button
            onClick={startTimer}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-lg"
          >
            開始
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all hover:scale-105 shadow-lg"
          >
            一時停止
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={resetTimer}
          className="border-2 border-gray-400 text-gray-700 hover:border-gray-600 hover:bg-gray-50 font-semibold py-2 px-6 rounded-full transition-all hover:scale-105"
        >
          リセット
        </button>
        <button
          onClick={skipToNext}
          className="border-2 border-gray-400 text-gray-700 hover:border-gray-600 hover:bg-gray-50 font-semibold py-2 px-6 rounded-full transition-all hover:scale-105"
        >
          スキップ
        </button>
      </div>

      {/* Stats */}
      <Stats completedCycles={state.completedCycles} />
    </div>
  );
}
