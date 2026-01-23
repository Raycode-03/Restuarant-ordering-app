export const sessionsApi = {
  startSession: async (tableNumber: number) => {
    const res = await fetch('/api/users/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table_number: tableNumber }),
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to start session');
    }

    return data;
  },

  validateSession: async () => {
    const res = await fetch('/api/users/session/validate', {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Session validation failed');
    }

    return data;
  },
};
