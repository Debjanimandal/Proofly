'use client';

import { useEffect, useRef, useState } from 'react';

type AuditEvent = {
  id: string;
  event_type: string;
  actor_address: string | null;
  created_at: string;
};

export default function RealtimeAudit(): JSX.Element {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let removed = false;

    async function fetchLogs(): Promise<void> {
      try {
        const response = await fetch('/api/activity/logs');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as { logs: AuditEvent[] };
        if (!removed) setEvents(data.logs ?? []);
      } catch (fetchError) {
        if (!removed) setError((fetchError as Error).message);
      }
    }

    void fetchLogs();
    intervalRef.current = setInterval(() => { void fetchLogs(); }, 4000);

    return () => {
      removed = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold tracking-tight">Audit Feed</h2>
      <p className="mt-2 text-sm text-subtext">Live updates from proof, policy, media, and transaction events.</p>

      {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}

      <ul className="mt-4 space-y-2">
        {events.map((event) => (
          <li key={event.id} className="flex items-center justify-between text-xs">
            <span className="font-mono text-accent">{event.event_type}</span>
            <span className="text-subtext">
              {event.actor_address ? `${event.actor_address.slice(0, 8)}…` : 'system'}
            </span>
            <time className="text-subtext">{new Date(event.created_at).toLocaleTimeString()}</time>
          </li>
        ))}
        {events.length === 0 && !error ? (
          <li className="text-xs text-subtext">No events yet.</li>
        ) : null}
      </ul>
    </section>
  );
}
