// lib/api/dashboard.ts
import { DashboardStats } from "@/types";

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch('/api/admin/staff/stats');
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return res.json();
  },
};