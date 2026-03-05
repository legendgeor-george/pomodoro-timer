import { describe, it, expect } from 'vitest';

/**
 * Format time helper function extracted from Timer component
 * This tests the time formatting logic independently
 */
function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

describe('formatTime utility', () => {
  describe('standard cases', () => {
    it('should format 25 minutes (work session)', () => {
      expect(formatTime(25 * 60)).toBe('25:00');
    });

    it('should format 5 minutes (break session)', () => {
      expect(formatTime(5 * 60)).toBe('05:00');
    });

    it('should format zero time', () => {
      expect(formatTime(0)).toBe('00:00');
    });

    it('should format 1 second', () => {
      expect(formatTime(1)).toBe('00:01');
    });

    it('should format 59 seconds', () => {
      expect(formatTime(59)).toBe('00:59');
    });

    it('should format 1 minute exactly', () => {
      expect(formatTime(60)).toBe('01:00');
    });
  });

  describe('edge cases', () => {
    it('should pad single digit minutes', () => {
      expect(formatTime(540)).toBe('09:00'); // 9 minutes
    });

    it('should pad single digit seconds', () => {
      expect(formatTime(5)).toBe('00:05');
    });

    it('should handle mixed single digits', () => {
      expect(formatTime(545)).toBe('09:05'); // 9 minutes 5 seconds
    });

    it('should handle double digit minutes and seconds', () => {
      expect(formatTime(754)).toBe('12:34'); // 12 minutes 34 seconds
    });

    it('should handle 99:59 (maximum typical pomodoro)', () => {
      expect(formatTime(5999)).toBe('99:59');
    });

    it('should handle hours (over 60 minutes)', () => {
      expect(formatTime(3661)).toBe('61:01'); // 1 hour 1 minute 1 second
    });
  });

  describe('boundary values', () => {
    it('should format start of minute boundaries', () => {
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(120)).toBe('02:00');
      expect(formatTime(300)).toBe('05:00');
      expect(formatTime(1500)).toBe('25:00');
    });

    it('should format end of minute boundaries', () => {
      expect(formatTime(119)).toBe('01:59');
      expect(formatTime(179)).toBe('02:59');
      expect(formatTime(359)).toBe('05:59');
      expect(formatTime(1559)).toBe('25:59');
    });
  });

  describe('real-world pomodoro scenarios', () => {
    it('should format work session start', () => {
      expect(formatTime(1500)).toBe('25:00');
    });

    it('should format work session halfway', () => {
      expect(formatTime(750)).toBe('12:30');
    });

    it('should format work session near end', () => {
      expect(formatTime(10)).toBe('00:10');
    });

    it('should format break session start', () => {
      expect(formatTime(300)).toBe('05:00');
    });

    it('should format break session halfway', () => {
      expect(formatTime(150)).toBe('02:30');
    });

    it('should format break session near end', () => {
      expect(formatTime(5)).toBe('00:05');
    });
  });

  describe('calculation correctness', () => {
    it('should correctly calculate minutes from seconds', () => {
      expect(formatTime(125)).toBe('02:05'); // 125 / 60 = 2.08 -> floor = 2
      expect(formatTime(185)).toBe('03:05'); // 185 / 60 = 3.08 -> floor = 3
    });

    it('should correctly calculate remaining seconds', () => {
      expect(formatTime(125)).toBe('02:05'); // 125 % 60 = 5
      expect(formatTime(185)).toBe('03:05'); // 185 % 60 = 5
    });

    it('should handle modulo for exact minutes', () => {
      expect(formatTime(180)).toBe('03:00'); // 180 % 60 = 0
    });
  });

  describe('string padding', () => {
    it('should pad minutes with leading zero when < 10', () => {
      for (let i = 0; i < 10; i++) {
        const formatted = formatTime(i * 60);
        expect(formatted).toMatch(/^0\d:\d{2}$/);
      }
    });

    it('should pad seconds with leading zero when < 10', () => {
      for (let i = 0; i < 10; i++) {
        const formatted = formatTime(i);
        expect(formatted).toMatch(/^\d{2}:0\d$/);
      }
    });

    it('should always produce MM:SS format', () => {
      const testCases = [0, 1, 59, 60, 61, 599, 600, 1499, 1500, 3599];
      testCases.forEach(seconds => {
        const formatted = formatTime(seconds);
        expect(formatted).toMatch(/^\d{2}:\d{2}$/);
      });
    });
  });
});
