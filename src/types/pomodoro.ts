export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number; // 秒単位
  isRunning: boolean;
  completedCycles: number; // 完了した作業サイクル数
}

export interface TimerSettings {
  workDuration: number; // デフォルト 25分 (1500秒)
  shortBreakDuration: number; // デフォルト 5分 (300秒)
  longBreakDuration: number; // デフォルト 15分 (900秒)
  cyclesBeforeLongBreak: number; // デフォルト 4
}
