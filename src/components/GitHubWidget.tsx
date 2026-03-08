'use client';

import { useState, useEffect } from 'react';

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: { message: string }[];
    ref?: string;
    ref_type?: string;
  };
}

function describeEvent(event: GitHubEvent): string {
  switch (event.type) {
    case 'PushEvent': {
      const msg = event.payload.commits?.[0]?.message ?? 'a commit';
      return `Pushed: "${msg}"`;
    }
    case 'CreateEvent':
      return `Created ${event.payload.ref_type ?? 'repository'} ${event.payload.ref ? `"${event.payload.ref}"` : ''}`.trim();
    case 'DeleteEvent':
      return `Deleted ${event.payload.ref_type} "${event.payload.ref}"`;
    case 'IssuesEvent':
      return 'Opened an issue';
    case 'PullRequestEvent':
      return 'Opened a pull request';
    case 'WatchEvent':
      return 'Starred a repository';
    case 'ForkEvent':
      return 'Forked a repository';
    default:
      return event.type.replace('Event', '');
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default function GitHubWidget() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/github');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setEvents(data);
      } catch {
        setError('Could not load GitHub activity.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">GitHub Activity</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">GitHub Activity</h2>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">GitHub Activity</h2>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400">No recent public activity.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="flex flex-col gap-0.5">
              <span className="text-sm text-gray-700 leading-snug">{describeEvent(event)}</span>
              <div className="flex gap-2 text-xs text-gray-400">
                <span>{event.repo.name}</span>
                <span>·</span>
                <span>{timeAgo(event.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
