import { useState, useEffect } from 'react';
import { Settings } from '@/types';
import { storage } from '@/utils/storage';

const defaultSettings: Settings = {
  workDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  autoStartBreak: false,
  autoStartWork: false,
  soundEnabled: true,
  soundVolume: 50,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = storage.getSettings();
    if (saved) {
      setSettings(saved);
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  return { settings, updateSettings };
}
