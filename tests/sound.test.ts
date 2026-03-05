import { describe, it, expect, beforeEach, vi } from 'vitest';
import { playNotificationSound, resetAudioContext } from '@/utils/sound';

// Mock AudioContext
let mockOscillator: any;
let mockGainNode: any;
let mockAudioContext: any;

describe('sound', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAudioContext();

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

    // Mock global AudioContext as a constructor function
    global.AudioContext = vi.fn(function(this: any) {
      this.createOscillator = vi.fn(() => mockOscillator);
      this.createGain = vi.fn(() => mockGainNode);
      this.destination = {};
      this.currentTime = 0;

      // Store reference for assertions
      mockAudioContext = this;
    }) as any;
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
      playNotificationSound();
      // The oscillator should stop at currentTime + 0.5
      // Since currentTime is 0 by default, it should be 0.5
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.5);
    });

    it('should not throw error when AudioContext is not available', () => {
      global.AudioContext = undefined as any;
      expect(() => playNotificationSound()).not.toThrow();
    });

    it('should handle errors gracefully and log to console', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Reset audioContext to clear cached instance
      resetAudioContext();

      // Create a mock that throws on createOscillator
      global.AudioContext = vi.fn(function(this: any) {
        this.createOscillator = vi.fn(() => {
          throw new Error('AudioContext error');
        });
        this.createGain = vi.fn(() => mockGainNode);
        this.destination = {};
        this.currentTime = 0;

        // Store reference for assertions
        mockAudioContext = this;
      }) as any;

      expect(() => playNotificationSound()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Audio notification failed:',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it('should create oscillator and gain node on each call', () => {
      playNotificationSound();
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();

      const firstOscillatorCallCount = mockAudioContext.createOscillator.mock.calls.length;

      playNotificationSound();

      // Should create new oscillator on second call
      expect(mockAudioContext.createOscillator.mock.calls.length).toBeGreaterThan(firstOscillatorCallCount);
    });
  });
});
