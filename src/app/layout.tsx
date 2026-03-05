import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description: '25分作業 + 5分休憩のポモドーロタイマー',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gradient-to-br from-red-50 to-orange-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
