import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const POLL_MS = 15000;

// Reflects whether the FastAPI backend is actually reachable, by pinging its
// root endpoint (`GET /` -> {"Hello": "World"}). Avoids showing a fake
// "online" badge when nothing is running behind it.
export function useBackendStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const check = async () => {
      try {
        const res = await fetch(API_BASE_URL, { signal: controller.signal });
        if (!cancelled) setStatus(res.ok ? 'online' : 'offline');
      } catch {
        if (!cancelled) setStatus('offline');
      }
    };

    check();
    const id = setInterval(check, POLL_MS);
    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(id);
    };
  }, []);

  return status;
}
