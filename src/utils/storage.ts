import { Settings, Session } from '@/types';

export const storage = {
  getSettings: (): Settings | null => {
    try {
      const data = localStorage.getItem('pomodoro-settings');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return null;
    }
  },

  saveSettings: (settings: Settings): void => {
    try {
      localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  getSessions: (): Session[] => {
    try {
      const data = localStorage.getItem('pomodoro-sessions');
      if (!data) return [];
      const sessions = JSON.parse(data);
      return sessions.map((s: any) => ({
        ...s,
        completedAt: new Date(s.completedAt),
      }));
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  },

  addSession: (session: Session): void => {
    try {
      const sessions = storage.getSessions();
      sessions.push(session);
      // 最大100件まで保持
      const limited = sessions.slice(-100);
      localStorage.setItem('pomodoro-sessions', JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to add session:', error);
    }
  },

  clearSessions: (): void => {
    try {
      localStorage.removeItem('pomodoro-sessions');
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  },
};
