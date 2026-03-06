import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, TimerMode, TimerSettings } from '@/types/pomodoro';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  cyclesBeforeLongBreak: 4,
};

export function usePomodoro(settings: TimerSettings = DEFAULT_SETTINGS) {
  const [state, setState] = useState<TimerState>({
    mode: 'work',
    timeLeft: settings.workDuration,
    isRunning: false,
    completedCycles: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3');
    }
  }, []);

  const playNotification = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback to beep if audio file not available
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
      });
    }
  }, []);

  const getNextMode = useCallback((currentMode: TimerMode, completedCycles: number): TimerMode => {
    if (currentMode === 'work') {
      return (completedCycles % settings.cyclesBeforeLongBreak === 0) ? 'longBreak' : 'shortBreak';
    }
    return 'work';
  }, [settings.cyclesBeforeLongBreak]);

  const getDuration = useCallback((mode: TimerMode): number => {
    switch (mode) {
      case 'work':
        return settings.workDuration;
      case 'shortBreak':
        return settings.shortBreakDuration;
      case 'longBreak':
        return settings.longBreakDuration;
    }
  }, [settings]);

  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState(prev => {
        if (prev.timeLeft <= 1) {
          // Timer completed
          playNotification();

          const newCycles = prev.mode === 'work' ? prev.completedCycles + 1 : prev.completedCycles;
          const nextMode = getNextMode(prev.mode, newCycles);

          return {
            mode: nextMode,
            timeLeft: getDuration(nextMode),
            isRunning: false,
            completedCycles: newCycles,
          };
        }

        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning, playNotification, getNextMode, getDuration]);

  const startTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeLeft: getDuration(prev.mode),
      isRunning: false,
    }));
  }, [getDuration]);

  const skipToNext = useCallback(() => {
    setState(prev => {
      const newCycles = prev.mode === 'work' ? prev.completedCycles + 1 : prev.completedCycles;
      const nextMode = getNextMode(prev.mode, newCycles);

      return {
        mode: nextMode,
        timeLeft: getDuration(nextMode),
        isRunning: false,
        completedCycles: newCycles,
      };
    });
  }, [getNextMode, getDuration]);

  return {
    state,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNext,
  };
}
