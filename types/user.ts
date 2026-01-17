import { User } from "@supabase/supabase-js";
import type { StaffMember } from "./staff";
export interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
}

export interface UserContextType {
  user: User;
  staff: StaffMember;
}
export type SectionKey = "staff" | "orders" | "menu" | "revenue";

export interface DashboardStats {
  success: boolean;
  staff: {
    total: number;
    active: number;
    onShift: number;
  };
  orders: {
    today: number;
    pending: number;
    completed: number;
  };
  menu: {
    total: number;
    outOfStock: number;
    popular: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    trend: string;
  };
}