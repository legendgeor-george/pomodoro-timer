import Timer from './components/Timer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        🍅 Pomodoro Timer
      </h1>
      <Timer />
    </main>
  )
}
