// lib/api/settings.ts
import {
  RestaurantSettings,
  ApiResponse,
} from '@/types/settings';

export const settingsApi = {
  getSettings: async (): Promise<ApiResponse<RestaurantSettings>> => {
    const res = await fetch('/api/admin/settings');
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch settings');
    }
    return res.json();
  },
  
  paymentChange: async (order_code: number): Promise<ApiResponse<RestaurantSettings>> => { 
    const res = await fetch('/api/admin/settings/payment-code', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_code }),
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      // Use 'error' field, not 'message'
      const errorMessage = result.error || `Failed to update order code (${res.status})`;
      throw new Error(errorMessage);
    }
    
    return result;
  },
  
  tableNumberChange: async (table_count: number): Promise<ApiResponse<RestaurantSettings>> => { 
    const res = await fetch('/api/admin/settings/tablenumber', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table_count }),
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      // Use 'error' field, not 'message'
      const errorMessage = result.error || `Failed to update table count (${res.status})`;
      throw new Error(errorMessage);
    }
    
    return result;
  },
};