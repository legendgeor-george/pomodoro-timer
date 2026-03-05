export type TimerMode = 'work' | 'break';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
}

export const TIMER_CONFIG = {
  work: 25 * 60,
  break: 5 * 60,
};
