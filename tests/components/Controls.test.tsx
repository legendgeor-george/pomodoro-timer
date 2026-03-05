import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Controls from '@/app/components/Controls';

describe('Controls', () => {
  const mockOnStart = vi.fn();
  const mockOnPause = vi.fn();
  const mockOnReset = vi.fn();
  const mockOnSkip = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Button Display', () => {
    it('should display start button when status is idle', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText('開始')).toBeInTheDocument();
      expect(screen.queryByText('一時停止')).not.toBeInTheDocument();
      expect(screen.queryByText('再開')).not.toBeInTheDocument();
    });

    it('should display resume button when status is paused', () => {
      render(
        <Controls
          status="paused"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText('再開')).toBeInTheDocument();
      expect(screen.queryByText('開始')).not.toBeInTheDocument();
      expect(screen.queryByText('一時停止')).not.toBeInTheDocument();
    });

    it('should display pause button when status is running', () => {
      render(
        <Controls
          status="running"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText('一時停止')).toBeInTheDocument();
      expect(screen.queryByText('開始')).not.toBeInTheDocument();
      expect(screen.queryByText('再開')).not.toBeInTheDocument();
    });

    it('should always display reset button', () => {
      const statuses: Array<'idle' | 'running' | 'paused'> = ['idle', 'running', 'paused'];

      statuses.forEach((status) => {
        const { unmount } = render(
          <Controls
            status={status}
            onStart={mockOnStart}
            onPause={mockOnPause}
            onReset={mockOnReset}
            onSkip={mockOnSkip}
          />
        );

        expect(screen.getByText('リセット')).toBeInTheDocument();
        unmount();
      });
    });

    it('should display skip button when onSkip is provided', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      expect(screen.getByText('スキップ')).toBeInTheDocument();
    });

    it('should not display skip button when onSkip is undefined', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      expect(screen.queryByText('スキップ')).not.toBeInTheDocument();
    });
  });

  describe('Button Handlers', () => {
    it('should call onStart when start button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const startButton = screen.getByText('開始');
      await user.click(startButton);

      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('should call onStart when resume button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="paused"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const resumeButton = screen.getByText('再開');
      await user.click(resumeButton);

      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('should call onPause when pause button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="running"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const pauseButton = screen.getByText('一時停止');
      await user.click(pauseButton);

      expect(mockOnPause).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="running"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByText('リセット');
      await user.click(resetButton);

      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });

    it('should call onSkip when skip button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      const skipButton = screen.getByText('スキップ');
      await user.click(skipButton);

      expect(mockOnSkip).toHaveBeenCalledTimes(1);
    });

    it('should not call other handlers when one button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      const startButton = screen.getByText('開始');
      await user.click(startButton);

      expect(mockOnStart).toHaveBeenCalledTimes(1);
      expect(mockOnPause).not.toHaveBeenCalled();
      expect(mockOnReset).not.toHaveBeenCalled();
      expect(mockOnSkip).not.toHaveBeenCalled();
    });
  });

  describe('Button Styles', () => {
    it('should have correct styles for start button', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const startButton = screen.getByText('開始');
      expect(startButton).toHaveClass('bg-blue-600');
    });

    it('should have correct styles for pause button', () => {
      render(
        <Controls
          status="running"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const pauseButton = screen.getByText('一時停止');
      expect(pauseButton).toHaveClass('bg-yellow-500');
    });

    it('should have correct styles for reset button', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByText('リセット');
      expect(resetButton).toHaveClass('bg-gray-600');
    });

    it('should have correct styles for skip button', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      const skipButton = screen.getByText('スキップ');
      expect(skipButton).toHaveClass('bg-purple-600');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label for start button', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const startButton = screen.getByText('開始');
      expect(startButton).toHaveAttribute('aria-label', '開始');
    });

    it('should have aria-label for pause button', () => {
      render(
        <Controls
          status="running"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const pauseButton = screen.getByText('一時停止');
      expect(pauseButton).toHaveAttribute('aria-label', '一時停止');
    });

    it('should have aria-label for reset button', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByText('リセット');
      expect(resetButton).toHaveAttribute('aria-label', 'リセット');
    });

    it('should have aria-label for skip button', () => {
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
          onSkip={mockOnSkip}
        />
      );

      const skipButton = screen.getByText('スキップ');
      expect(skipButton).toHaveAttribute('aria-label', 'スキップ');
    });
  });

  describe('Multiple Clicks', () => {
    it('should handle multiple clicks on start button', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="idle"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const startButton = screen.getByText('開始');
      await user.click(startButton);
      await user.click(startButton);
      await user.click(startButton);

      expect(mockOnStart).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple clicks on reset button', async () => {
      const user = userEvent.setup();
      render(
        <Controls
          status="running"
          onStart={mockOnStart}
          onPause={mockOnPause}
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByText('リセット');
      await user.click(resetButton);
      await user.click(resetButton);

      expect(mockOnReset).toHaveBeenCalledTimes(2);
    });
  });
});
