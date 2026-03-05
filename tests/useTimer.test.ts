import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '@/hooks/useTimer';
import { TIMER_CONFIG } from '@/types/timer';
import * as soundModule from '@/utils/sound';

// Mock sound module
vi.mock('@/utils/sound', () => ({
  playNotificationSound: vi.fn(),
}));

describe('useTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.work);
    expect(result.current.isRunning).toBe(false);
  });

  it('should start timer when startTimer is called', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.isRunning).toBe(true);
  });

  it('should pause timer when pauseTimer is called', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.pauseTimer();
    });

    expect(result.current.isRunning).toBe(false);
  });

  it('should reset timer to initial time for current mode', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.work);
  });

  it('should switch mode and update timeLeft', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.work);

    act(() => {
      result.current.switchMode('break');
    });

    expect(result.current.mode).toBe('break');
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.break);
    expect(result.current.isRunning).toBe(false);
  });

  it('should countdown time when timer is running', () => {
    const { result } = renderHook(() => useTimer());

    const initialTime = result.current.timeLeft;

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timeLeft).toBeLessThan(initialTime);
  });

  it('should play sound and switch mode when timer reaches zero', () => {
    const { result } = renderHook(() => useTimer());

    // Set initial mode to work
    expect(result.current.mode).toBe('work');

    act(() => {
      result.current.startTimer();
    });

    // Fast-forward to completion
    act(() => {
      vi.advanceTimersByTime(TIMER_CONFIG.work * 1000 + 2000);
    });

    expect(soundModule.playNotificationSound).toHaveBeenCalled();
    expect(result.current.isRunning).toBe(false);
    expect(result.current.mode).toBe('break');
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.break);
  });

  it('should switch from break to work when break timer completes', () => {
    const { result } = renderHook(() => useTimer());

    // Switch to break mode first
    act(() => {
      result.current.switchMode('break');
    });

    expect(result.current.mode).toBe('break');

    act(() => {
      result.current.startTimer();
    });

    // Fast-forward to completion
    act(() => {
      vi.advanceTimersByTime(TIMER_CONFIG.break * 1000 + 2000);
    });

    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.work);
  });

  it('should not countdown when timer is paused', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      result.current.pauseTimer();
    });

    const pausedTime = result.current.timeLeft;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Time should not change when paused
    expect(result.current.timeLeft).toBe(pausedTime);
  });

  it('should handle rapid start/pause/reset operations', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
      result.current.pauseTimer();
      result.current.startTimer();
      result.current.resetTimer();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.work);
  });

  it('should handle mode switching while timer is running', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      result.current.switchMode('break');
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.mode).toBe('break');
    expect(result.current.timeLeft).toBe(TIMER_CONFIG.break);
  });
});
