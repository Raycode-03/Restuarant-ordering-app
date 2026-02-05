import { MenuItem } from "@/types";

export const menuApi = {
  getMenus: async (page = 0, limit = 10): Promise<MenuItem[]> => {
    const offset = page * limit;
    const res = await fetch(`/api/users/menu/getmenus?limit=${limit}&offset=${offset}`);
    if (!res.ok) {
      throw new Error('Failed to fetch menus');
    }
    return res.json();
  }
}