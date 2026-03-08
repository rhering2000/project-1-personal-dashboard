'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const MOCK_WEATHER: WeatherData = {
  city: 'New York',
  temperature: 72,
  feelsLike: 69,
  description: 'Partly cloudy',
  humidity: 58,
  windSpeed: 9,
  icon: '⛅',
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        // TODO: Replace with real API call:
        // const res = await fetch('/api/weather');
        // const data = await res.json();
        // setWeather(data);
        setWeather(MOCK_WEATHER);
      } catch {
        setError('Failed to load weather data.');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Weather</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-100 rounded w-1/2" />
          <div className="h-12 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Weather</h2>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">Weather</h2>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-medium text-gray-600">{weather.city}</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-6xl font-semibold text-gray-800">{weather.temperature}°</span>
            <span className="text-gray-400 mb-2">F</span>
          </div>
          <p className="text-gray-500 capitalize">{weather.description}</p>
        </div>
        <span className="text-6xl">{weather.icon}</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-400">Feels like</p>
          <p className="text-sm font-medium text-gray-700">{weather.feelsLike}°</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Humidity</p>
          <p className="text-sm font-medium text-gray-700">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Wind</p>
          <p className="text-sm font-medium text-gray-700">{weather.windSpeed} mph</p>
        </div>
      </div>
    </div>
  );
}
