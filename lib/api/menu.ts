import { MenuItem } from "@/types";

interface MenuResponse {
  data: MenuItem[];
  total: number; // total count of available menu items for pagination
}

export const menuApi = {
  getMenus: async (page = 0, limit = 10): Promise<MenuResponse> => {
    const offset = page * limit;
    const res = await fetch(`/api/users/menu/getmenus?limit=${limit}&offset=${offset}`);
    if (res.status === 401) {
      throw new Error('Session expired'); 
    }
    if (!res.ok) {
      throw new Error('Failed to fetch menus');
    }
    
    return  res.json();
  },
 
}