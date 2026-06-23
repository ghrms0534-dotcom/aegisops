import { useEffect, useState } from 'react';

export interface DashboardEvent {
  type: 'dashboard_status_changed';
  service: string;
  status: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  data: Record<string, string | number>;
}

export type DashboardSocketStatus = 'connected' | 'disconnected' | 'reconnecting' | 'fallback';

export function useDashboardWebSocket() {
  const [status, setStatus] = useState<DashboardSocketStatus>('reconnecting');
  const [latestEvent, setLatestEvent] = useState<DashboardEvent | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let stopped = false;

    const connect = () => {
      if (stopped) return;
      setStatus('reconnecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      socket = new WebSocket(`${protocol}//${window.location.host}/ws/dashboard`);
      socket.onopen = () => setStatus('connected');
      socket.onmessage = message => {
        try {
          const event = JSON.parse(message.data);
          if (event.type === 'dashboard_status_changed') {
            setLatestEvent(event);
          }
        } catch {
          // Ignore malformed events and keep the live connection active.
        }
      };
      socket.onerror = () => setStatus('disconnected');
      socket.onclose = () => {
        if (stopped) return;
        setStatus('fallback');
        reconnectTimer = window.setTimeout(connect, 3000);
      };
    };

    connect();
    return () => {
      stopped = true;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      }
    };
  }, []);

  return { status, latestEvent };
}
