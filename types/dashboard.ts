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

export interface CardConfig<T extends string> {
  key: T;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: string;
  alert?: string;
}

export interface DashboardShellProps<T extends string> {
  title: string;
  subtitle?: string;
  cards: CardConfig<T>[];
  sections: Record<T, React.ReactNode>;
  loading?: boolean;
}