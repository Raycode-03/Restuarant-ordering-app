export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  video_url?: string;
  is_veg?: boolean;
  is_vegan?: boolean;
  is_available?: boolean;
}

export interface MenuItemWithRestaurant extends MenuItem {
  restaurant_id: string;
}