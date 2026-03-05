import { useState, useEffect } from 'react';
import { TimerMode, TIMER_CONFIG } from '@/types/timer';
import { playNotificationSound } from '@/utils/sound';

export const useTimer = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_CONFIG.work);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const endTime = Date.now() + (timeLeft * 1000);
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        playNotificationSound();
        setIsRunning(false);
        const newMode: TimerMode = mode === 'work' ? 'break' : 'work';
        setMode(newMode);
        setTimeLeft(TIMER_CONFIG[newMode]);
      }
    }, 100); // 100msごとにチェックして精度向上

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const startTimer = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setStartTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIG[mode]);
    setStartTime(null);
    setAccumulatedTime(0);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_CONFIG[newMode]);
    setIsRunning(false);
    setStartTime(null);
    setAccumulatedTime(0);
  };

  return {
    timeLeft,
    isRunning,
    mode,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  };
};
