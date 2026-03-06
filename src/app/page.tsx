import Timer from '@/components/Timer';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="bg-white rounded-3xl shadow-2xl p-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          ポモドーロタイマー
        </h1>
        <Timer />
      </div>
    </main>
  );
}
