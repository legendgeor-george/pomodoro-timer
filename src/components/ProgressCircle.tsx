import React from 'react';

interface ProgressCircleProps {
  progress: number; // 0-100
  size: number;
  strokeWidth: number;
  timeDisplay: string;
  mode: 'work' | 'shortBreak' | 'longBreak';
}

export function ProgressCircle({ progress, size, strokeWidth, timeDisplay, mode }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const progressColor = mode === 'work' ? '#ef4444' : '#10b981';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl font-bold text-gray-800">{timeDisplay}</span>
      </div>
    </div>
  );
}
