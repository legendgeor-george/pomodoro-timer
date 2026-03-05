import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SessionInfo from '@/app/components/SessionInfo';

describe('SessionInfo', () => {
  describe('Text Display', () => {
    it('should display completed pomodoros count', () => {
      render(<SessionInfo completedPomodoros={0} totalRequired={4} />);
      expect(screen.getByText(/完了: 0 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should display correct count for 1 completed pomodoro', () => {
      render(<SessionInfo completedPomodoros={1} totalRequired={4} />);
      expect(screen.getByText(/完了: 1 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should display correct count for multiple completed pomodoros', () => {
      render(<SessionInfo completedPomodoros={3} totalRequired={4} />);
      expect(screen.getByText(/完了: 3 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should display correct count when completed equals total', () => {
      render(<SessionInfo completedPomodoros={4} totalRequired={4} />);
      expect(screen.getByText(/完了: 4 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });

    it('should display correct count when completed exceeds total', () => {
      render(<SessionInfo completedPomodoros={5} totalRequired={4} />);
      expect(screen.getByText(/完了: 5 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });
  });

  describe('Progress Dots', () => {
    it('should render correct number of dots', () => {
      render(<SessionInfo completedPomodoros={0} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);
      expect(dots).toHaveLength(4);
    });

    it('should render 3 dots when totalRequired is 3', () => {
      render(<SessionInfo completedPomodoros={0} totalRequired={3} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);
      expect(dots).toHaveLength(3);
    });

    it('should render all dots as gray when no pomodoros completed', () => {
      render(<SessionInfo completedPomodoros={0} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      dots.forEach((dot) => {
        expect(dot).toHaveClass('bg-gray-300');
        expect(dot).not.toHaveClass('bg-rose-500');
      });
    });

    it('should render first dot as red when 1 pomodoro completed', () => {
      render(<SessionInfo completedPomodoros={1} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      expect(dots[0]).toHaveClass('bg-rose-500');
      expect(dots[1]).toHaveClass('bg-gray-300');
      expect(dots[2]).toHaveClass('bg-gray-300');
      expect(dots[3]).toHaveClass('bg-gray-300');
    });

    it('should render first two dots as red when 2 pomodoros completed', () => {
      render(<SessionInfo completedPomodoros={2} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      expect(dots[0]).toHaveClass('bg-rose-500');
      expect(dots[1]).toHaveClass('bg-rose-500');
      expect(dots[2]).toHaveClass('bg-gray-300');
      expect(dots[3]).toHaveClass('bg-gray-300');
    });

    it('should render all dots as red when all pomodoros completed', () => {
      render(<SessionInfo completedPomodoros={4} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      // 4 % 4 = 0 && completedPomodoros > 0, so use totalRequired (all dots red)
      dots.forEach((dot) => {
        expect(dot).toHaveClass('bg-rose-500');
        expect(dot).not.toHaveClass('bg-gray-300');
      });
    });

    it('should handle modulo correctly when completed exceeds total', () => {
      render(<SessionInfo completedPomodoros={5} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      // 5 % 4 = 1, so only first dot should be red
      expect(dots[0]).toHaveClass('bg-rose-500');
      expect(dots[1]).toHaveClass('bg-gray-300');
      expect(dots[2]).toHaveClass('bg-gray-300');
      expect(dots[3]).toHaveClass('bg-gray-300');
    });

    it('should handle second cycle correctly (8 completed, 4 total)', () => {
      render(<SessionInfo completedPomodoros={8} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      // 8 % 4 = 0 && completedPomodoros > 0, so all dots should be red
      dots.forEach((dot) => {
        expect(dot).toHaveClass('bg-rose-500');
      });
    });

    it('should handle partial second cycle (6 completed, 4 total)', () => {
      render(<SessionInfo completedPomodoros={6} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      // 6 % 4 = 2, so first two dots should be red
      expect(dots[0]).toHaveClass('bg-rose-500');
      expect(dots[1]).toHaveClass('bg-rose-500');
      expect(dots[2]).toHaveClass('bg-gray-300');
      expect(dots[3]).toHaveClass('bg-gray-300');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-labels for all dots', () => {
      render(<SessionInfo completedPomodoros={0} totalRequired={4} />);

      expect(screen.getByLabelText('ポモドーロ 1')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 2')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 3')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 4')).toBeInTheDocument();
    });

    it('should have correct aria-labels for different total counts', () => {
      render(<SessionInfo completedPomodoros={0} totalRequired={3} />);

      expect(screen.getByLabelText('ポモドーロ 1')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 2')).toBeInTheDocument();
      expect(screen.getByLabelText('ポモドーロ 3')).toBeInTheDocument();
      expect(screen.queryByLabelText('ポモドーロ 4')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero total required', () => {
      render(<SessionInfo completedPomodoros={0} totalRequired={0} />);
      const dots = screen.queryAllByLabelText(/^ポモドーロ \d$/);
      expect(dots).toHaveLength(0);
    });

    it('should handle large completed numbers', () => {
      render(<SessionInfo completedPomodoros={100} totalRequired={4} />);
      expect(screen.getByText(/完了: 100 \/ 4 ポモドーロ/)).toBeInTheDocument();

      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);
      // 100 % 4 = 0 && completedPomodoros > 0, all dots should be red
      dots.forEach((dot) => {
        expect(dot).toHaveClass('bg-rose-500');
      });
    });

    it('should handle negative completed numbers gracefully', () => {
      render(<SessionInfo completedPomodoros={-1} totalRequired={4} />);
      expect(screen.getByText(/完了: -1 \/ 4 ポモドーロ/)).toBeInTheDocument();
    });
  });

  describe('Visual Structure', () => {
    it('should render dots in a flex container', () => {
      render(<SessionInfo completedPomodoros={2} totalRequired={4} />);
      const dots = screen.getAllByLabelText(/^ポモドーロ \d$/);

      // Check that dots have rounded-full class for circular shape
      dots.forEach((dot) => {
        expect(dot).toHaveClass('rounded-full');
        expect(dot).toHaveClass('w-4');
        expect(dot).toHaveClass('h-4');
      });
    });
  });
});
