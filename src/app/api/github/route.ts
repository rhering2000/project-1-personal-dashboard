import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'rhering2000';

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public`,
      {
        headers: { 'Accept': 'application/vnd.github+json' },
        next: { revalidate: 300 }, // cache for 5 minutes
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: res.status });
    }

    const events = await res.json();
    return NextResponse.json(events.slice(0, 10));
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
