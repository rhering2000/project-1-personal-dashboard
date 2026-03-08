'use client';

import { useState, useEffect } from 'react';

export default function ClockWidget() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Clock</h2>
      <div className="text-6xl font-mono font-semibold text-gray-800">
        {hours}:{minutes}:{seconds}
      </div>
      <div className="text-gray-500 mt-2">{date}</div>
    </div>
  );
}
