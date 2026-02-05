import { MenuItem , CreateMenuItem} from "@/types";

export const adminMenuApi = {
  getMenus: async (page = 0, limit = 10): Promise<MenuItem[]> => {
    const offset = page * limit;
    const res = await fetch(`/api/admin/menu/getmenus?limit=${limit}&offset=${offset}`);
    if (!res.ok) {
      throw new Error('Failed to fetch menus');
    }
    return res.json();
  },
  editMenu: async (formData: FormData) => {
    // Get ID from formData
    const id = formData.get('id') as string;
    
    if (!id) {
      throw new Error('Menu ID is required');
    }
    const res = await fetch(`/api/admin/menu/edit`, {
      method: 'PUT',
      body: formData, 
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to edit menu');
    }
    
    return res.json();
  },
  deleteMenu: async(id: string) => {
    const res = await fetch(`/api/admin/menu/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      throw new Error('Failed to delete menu');
    }
  },

  bulkUploadMenus: async (items: CreateMenuItem[]) => {
    const res = await fetch('/api/admin/menu/bulk-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to bulk upload menus');
    }
    
    return res.json();
  },
};
