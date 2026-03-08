import ClockWidget from '@/components/ClockWidget';
import TodoWidget from '@/components/TodoWidget';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-8">My Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ClockWidget />
        <TodoWidget />
      </div>
    </main>
  );
}
