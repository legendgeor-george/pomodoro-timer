import { useCallback, useRef } from 'react';

export function useSound(enabled: boolean, volume: number) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(() => {
    if (!enabled) return;

    try {
      // AudioContext を初期化（遅延初期化でユーザー操作後に許可される）
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 440; // A4音
      oscillator.type = 'sine';

      const volumeLevel = volume / 100;
      gainNode.gain.setValueAtTime(volumeLevel * 0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }, [enabled, volume]);

  return { playSound };
}
