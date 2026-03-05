export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerState {
  mode: TimerMode;
  timeLeft: number; // 秒単位
  isRunning: boolean;
  completedPomodoros: number; // 完了したポモドーロ数
  currentCycle: number; // 現在のサイクル（1-4）
}

export interface Settings {
  workDuration: number; // デフォルト: 25分 -> 1500秒
  shortBreakDuration: number; // デフォルト: 5分 -> 300秒
  longBreakDuration: number; // デフォルト: 15分 -> 900秒
  autoStartBreak: boolean; // 自動で休憩開始
  autoStartWork: boolean; // 自動で作業開始
  soundEnabled: boolean; // 音声通知有効化
  soundVolume: number; // 0-100
}

export interface Session {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
}
