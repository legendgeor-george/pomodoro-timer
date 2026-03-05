import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Timer from '@/app/components/Timer';

// Mock AudioContext
beforeEach(() => {
  vi.clearAllMocks();

  const mockOscillator = {
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
    type: 'sine' as OscillatorType,
  };

  const mockGainNode = {
    connect: vi.fn(),
    gain: {
      value: 0,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  };

  const mockAudioContext = {
    createOscillator: vi.fn(() => mockOscillator),
    createGain: vi.fn(() => mockGainNode),
    destination: {},
    currentTime: 0,
  };

  global.AudioContext = vi.fn(() => mockAudioContext) as any;
});

describe('Timer Component', () => {
  describe('Initial Rendering', () => {
    it('should display default work time of 25:00', () => {
      render(<Timer />);
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('should display work mode label', () => {
      render(<Timer />);
      expect(screen.getByText('作業中 🎯')).toBeInTheDocument();
    });

    it('should display start button when idle', () => {
      render(<Timer />);
      expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
    });

    it('should have rose background for work mode', () => {
      render(<Timer />);
      const timerCircle = screen.getByText('25:00').parentElement;
      expect(timerCircle).toHaveClass('bg-rose-500');
    });

    it('should show 0 completed pomodoros initially', () => {
      render(<Timer />);
      expect(screen.getByText(/完了: 0 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should display all control buttons', () => {
      render(<Timer />);
      expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /リセット/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /スキップ/ })).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should show pause button after clicking start', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /開始/ });
      await user.click(startButton);

      expect(screen.getByRole('button', { name: /一時停止/ })).toBeInTheDocument();
    });

    it('should show resume button after pausing', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /開始/ });
      await user.click(startButton);

      const pauseButton = screen.getByRole('button', { name: /一時停止/ });
      await user.click(pauseButton);

      expect(screen.getByText('再開')).toBeInTheDocument();
    });

    it('should return to start button after reset', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /開始/ });
      await user.click(startButton);

      const resetButton = screen.getByRole('button', { name: /リセット/ });
      await user.click(resetButton);

      expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });
  });

  describe('Mode Switching via Skip', () => {
    it('should switch to short break when skipping work', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      expect(screen.getByText('作業中 🎯')).toBeInTheDocument();

      const skipButton = screen.getByRole('button', { name: /スキップ/ });
      await user.click(skipButton);

      expect(screen.getByText('休憩中 ☕')).toBeInTheDocument();
      expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('should increment completed count when skipping work', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      expect(screen.getByText(/完了: 0 \/ 4 ポモドーロ/)).toBeInTheDocument();

      const skipButton = screen.getByRole('button', { name: /スキップ/ });
      await user.click(skipButton);

      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should switch back to work when skipping break', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });

      // Skip work to get to break
      await user.click(skipButton);
      expect(screen.getByText('休憩中 ☕')).toBeInTheDocument();

      // Skip break to return to work
      await user.click(skipButton);
      expect(screen.getByText('作業中 🎯')).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('should not increment count when skipping break', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });

      // Skip work (count becomes 1)
      await user.click(skipButton);
      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();

      // Skip break (count should stay 1)
      await user.click(skipButton);
      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should go to long break after 4th pomodoro', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });

      // Complete 4 pomodoros
      for (let i = 0; i < 4; i++) {
        await user.click(skipButton); // Skip work

        if (i < 3) {
          expect(screen.getByText('休憩中 ☕')).toBeInTheDocument();
          await user.click(skipButton); // Skip break
        }
      }

      // After 4th pomodoro, should be in long break
      expect(screen.getByText('長い休憩 🌟')).toBeInTheDocument();
      expect(screen.getByText('15:00')).toBeInTheDocument();
      expect(screen.getByText(/完了: 4 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });
  });

  describe('Mode Colors', () => {
    it('should have rose background in work mode', () => {
      render(<Timer />);
      const timerCircle = screen.getByText('25:00').parentElement;
      expect(timerCircle).toHaveClass('bg-rose-500');
    });

    it('should have green background in short break mode', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });
      await user.click(skipButton);

      const timerCircle = screen.getByText('05:00').parentElement;
      expect(timerCircle).toHaveClass('bg-green-500');
    });

    it('should have blue background in long break mode', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });

      // Skip to 4th pomodoro completion
      for (let i = 0; i < 4; i++) {
        await user.click(skipButton);
        if (i < 3) {
          await user.click(skipButton);
        }
      }

      const timerCircle = screen.getByText('15:00').parentElement;
      expect(timerCircle).toHaveClass('bg-blue-500');
    });
  });

  describe('Session Progress Indicators', () => {
    it('should show correct number of progress dots', () => {
      render(<Timer />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);
      expect(dots).toHaveLength(4);
    });

    it('should update progress dots after completing pomodoros', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });

      // Initially all gray
      let dots = screen.getAllByLabelText(/^ポモドーロ \d$/);
      expect(dots[0]).toHaveClass('bg-gray-300');

      // Complete 1 pomodoro
      await user.click(skipButton);

      dots = screen.getAllByLabelText(/^ポモドーロ \d$/);
      expect(dots[0]).toHaveClass('bg-rose-500');
      expect(dots[1]).toHaveClass('bg-gray-300');
    });

    it('should show all dots red after 4 completions', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });

      // Complete 4 pomodoros
      for (let i = 0; i < 4; i++) {
        await user.click(skipButton);
        if (i < 3) {
          await user.click(skipButton);
        }
      }

      // After 4 completions, all dots should be red
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);
      dots.forEach(dot => {
        expect(dot).toHaveClass('bg-rose-500');
      });
    });
  });

  describe('Reset Functionality', () => {
    it('should reset work timer to 25:00', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /開始/ });
      await user.click(startButton);

      const resetButton = screen.getByRole('button', { name: /リセット/ });
      await user.click(resetButton);

      expect(screen.getByText('25:00')).toBeInTheDocument();
      expect(screen.getByText('作業中 🎯')).toBeInTheDocument();
    });

    it('should reset break timer to 05:00', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });
      await user.click(skipButton);

      expect(screen.getByText('05:00')).toBeInTheDocument();

      const startButton = screen.getByRole('button', { name: /開始/ });
      await user.click(startButton);

      const resetButton = screen.getByRole('button', { name: /リセット/ });
      await user.click(resetButton);

      expect(screen.getByText('05:00')).toBeInTheDocument();
      expect(screen.getByText('休憩中 ☕')).toBeInTheDocument();
    });

    it('should preserve pomodoro count after reset', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });
      await user.click(skipButton);

      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();

      // Skip back to work
      await user.click(skipButton);

      const resetButton = screen.getByRole('button', { name: /リセット/ });
      await user.click(resetButton);

      // Count should be preserved
      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });
  });

  describe('Complex Flows', () => {
    it('should handle multiple skip operations correctly', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });

      // Work -> Break
      await user.click(skipButton);
      expect(screen.getByText('休憩中 ☕')).toBeInTheDocument();
      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();

      // Break -> Work
      await user.click(skipButton);
      expect(screen.getByText('作業中 🎯')).toBeInTheDocument();
      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();

      // Work -> Break
      await user.click(skipButton);
      expect(screen.getByText('休憩中 ☕')).toBeInTheDocument();
      expect(screen.getByText(/完了: 2 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should handle start-pause-reset sequence', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /開始/ });
      await user.click(startButton);

      const pauseButton = screen.getByRole('button', { name: /一時停止/ });
      await user.click(pauseButton);

      const resetButton = screen.getByRole('button', { name: /リセット/ });
      await user.click(resetButton);

      expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('should handle skip while paused', async () => {
      const user = userEvent.setup();
      render(<Timer />);

      const startButton = screen.getByRole('button', { name: /開始/ });
      await user.click(startButton);

      const pauseButton = screen.getByRole('button', { name: /一時停止/ });
      await user.click(pauseButton);

      const skipButton = screen.getByRole('button', { name: /スキップ/ });
      await user.click(skipButton);

      // Should skip to break and reset to idle
      expect(screen.getByText('休憩中 ☕')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<Timer />);

      expect(screen.getByRole('button', { name: /開始/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /リセット/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /スキップ/ })).toBeInTheDocument();
    });

    it('should have labeled progress indicators', () => {
      render(<Timer />);

      expect(screen.getByLabelText('ポモドーロ 1')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 2')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 3')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 4')).toBeInTheDocument();
    });
  });
});
