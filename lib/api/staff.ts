export const staffApi = {
  getAll: async () => {
    const res = await fetch('/api/admin/staff');
    if (!res.ok) throw new Error('Failed to fetch staff');
    return res.json();
  },

  promote: async (staffId: string) => {
    const res = await fetch('/api/admin/staff/promote', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    });
    if (!res.ok) throw new Error('Failed to promote staff');
    return res.json();
  },

  activate: async (staffId: string) => {
    const res = await fetch('/api/admin/staff/activate', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    });
    if (!res.ok) throw new Error('Failed to activate staff');
    return res.json();
  },

  deactivate: async (staffId: string) => {
    const res = await fetch('/api/admin/staff/deactivate', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    });
    if (!res.ok) throw new Error('Failed to deactivate staff');
    return res.json();
  },
};