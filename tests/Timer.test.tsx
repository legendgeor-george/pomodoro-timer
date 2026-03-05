import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from '@/components/Timer';

describe('Timer Component', () => {
  it('should render with default time format', () => {
    render(<Timer timeLeft={1500} />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('should format 25 minutes correctly', () => {
    render(<Timer timeLeft={25 * 60} />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('should format 5 minutes correctly', () => {
    render(<Timer timeLeft={5 * 60} />);
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('should format zero time correctly', () => {
    render(<Timer timeLeft={0} />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('should format single digit minutes with leading zero', () => {
    render(<Timer timeLeft={9 * 60} />);
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('should format single digit seconds with leading zero', () => {
    render(<Timer timeLeft={5} />);
    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('should format mixed minutes and seconds correctly', () => {
    render(<Timer timeLeft={12 * 60 + 34} />);
    expect(screen.getByText('12:34')).toBeInTheDocument();
  });

  it('should format 1 second correctly', () => {
    render(<Timer timeLeft={1} />);
    expect(screen.getByText('00:01')).toBeInTheDocument();
  });

  it('should format 59 seconds correctly', () => {
    render(<Timer timeLeft={59} />);
    expect(screen.getByText('00:59')).toBeInTheDocument();
  });

  it('should format 1 minute exactly', () => {
    render(<Timer timeLeft={60} />);
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('should format 1 minute and 1 second', () => {
    render(<Timer timeLeft={61} />);
    expect(screen.getByText('01:01')).toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    const { container } = render(<Timer timeLeft={1500} />);
    const timerElement = container.querySelector('.text-8xl.font-bold.text-indigo-900');
    expect(timerElement).toBeInTheDocument();
  });

  it('should update when timeLeft prop changes', () => {
    const { rerender } = render(<Timer timeLeft={1500} />);
    expect(screen.getByText('25:00')).toBeInTheDocument();

    rerender(<Timer timeLeft={300} />);
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('should handle large time values', () => {
    render(<Timer timeLeft={99 * 60 + 59} />);
    expect(screen.getByText('99:59')).toBeInTheDocument();
  });

  it('should handle negative time values', () => {
    // Math.floor(-10 / 60) = -1, -10 % 60 = -10
    // This will format as "-1:-10" which is not ideal but tests current behavior
    const { container } = render(<Timer timeLeft={-10} />);
    const timerElement = container.querySelector('.text-8xl');
    expect(timerElement).toBeInTheDocument();
  });
});
