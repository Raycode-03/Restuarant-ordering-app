import { MenuItem } from "@/types";

export const menuApi = {
  getMenus: async (page = 0, limit = 10): Promise<MenuItem[]> => {
    const offset = page * limit;
    const res = await fetch(`/api/users/menu/getmenus?limit=${limit}&offset=${offset}`);
    if (!res.ok) {
      throw new Error('Failed to fetch menus');
    }
    return res.json();
  },
  addCart: async (menuId: string): Promise<void> => {
    const res = await fetch(`/api/users/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menuId }),
    });
    if (!res.ok) {
      throw new Error('Failed to add item to cart');
    }
  }
}