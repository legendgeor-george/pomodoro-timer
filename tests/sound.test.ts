import { describe, it, expect, beforeEach, vi } from 'vitest';
import { playNotificationSound } from '@/utils/sound';

// Mock AudioContext
let mockOscillator: any;
let mockGainNode: any;
let mockAudioContext: any;

describe('sound', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Create fresh mock objects for each test
    mockOscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { value: 0 },
    };

    mockGainNode = {
      connect: vi.fn(),
      gain: { value: 0 },
    };

    mockAudioContext = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      destination: {},
      currentTime: 0,
    };

    // Mock global AudioContext as a class
    global.AudioContext = class {
      createOscillator = mockAudioContext.createOscillator;
      createGain = mockAudioContext.createGain;
      destination = mockAudioContext.destination;
      currentTime = mockAudioContext.currentTime;
    } as any;
  });

  describe('playNotificationSound', () => {
    it('should create AudioContext on first call', () => {
      playNotificationSound();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should create oscillator and gain node', () => {
      playNotificationSound();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
    });

    it('should connect oscillator to gain node', () => {
      playNotificationSound();
      expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
    });

    it('should connect gain node to destination', () => {
      playNotificationSound();
      expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
    });

    it('should set oscillator frequency to 800Hz', () => {
      playNotificationSound();
      expect(mockOscillator.frequency.value).toBe(800);
    });

    it('should set gain value to 0.3', () => {
      playNotificationSound();
      expect(mockGainNode.gain.value).toBe(0.3);
    });

    it('should start and stop oscillator', () => {
      playNotificationSound();
      expect(mockOscillator.start).toHaveBeenCalled();
      expect(mockOscillator.stop).toHaveBeenCalled();
    });

    it('should stop oscillator after 0.5 seconds', () => {
      mockAudioContext.currentTime = 10;
      playNotificationSound();
      expect(mockOscillator.stop).toHaveBeenCalledWith(10.5);
    });

    it('should not throw error when AudioContext is not available', () => {
      global.AudioContext = undefined as any;
      expect(() => playNotificationSound()).not.toThrow();
    });

    it('should handle errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      global.AudioContext = vi.fn(() => {
        throw new Error('AudioContext not supported');
      }) as any;

      expect(() => playNotificationSound()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Audio notification failed:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should reuse AudioContext on subsequent calls', () => {
      playNotificationSound();
      const firstCallCount = mockAudioContext.createOscillator.mock.calls.length;

      playNotificationSound();
      const secondCallCount = mockAudioContext.createOscillator.mock.calls.length;

      // Should create oscillator and gain node each time
      expect(secondCallCount).toBeGreaterThan(firstCallCount);
    });
  });
});
