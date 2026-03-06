import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ポモドーロタイマー',
  description: '集中力を高める時間管理ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
