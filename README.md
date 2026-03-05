# Pomodoro Timer

A simple and elegant Pomodoro timer built with Next.js to help you stay focused and productive.

## What is this?

This is a timer that helps you work in focused blocks of time. Work for 25 minutes, then take a 5-minute break. The timer automatically switches between work and break periods, playing a sound when it's time to switch.

## Features

- **25-minute work sessions** - Stay focused on one task
- **5-minute breaks** - Rest and recharge
- **Automatic switching** - Timer switches between work and break automatically
- **Sound notifications** - Get notified when it's time to switch
- **Simple controls** - Start, pause, and reset with one click
- **Mode switching** - Manually switch between work and break modes

## Getting Started

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## How to Use

1. **Click Start** to begin a 25-minute work session
2. **Focus on your work** until you hear the notification sound
3. **Take a 5-minute break** when the timer switches automatically
4. **Repeat** the cycle to stay productive

### Controls

- **Start** - Begin the timer
- **Pause** - Temporarily stop the timer
- **Reset** - Reset the current session to its starting time
- **Work/Break buttons** - Switch modes manually

## Technology Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Project Structure

```
src/
├── app/              # Next.js app pages
├── components/       # React components (Timer, Controls, etc.)
├── hooks/           # Custom React hooks (useTimer)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions (sound notifications)
```

## License

Private project - not for public distribution.
