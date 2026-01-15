"use client";
import { Users, ShoppingCart, Utensils, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/admin/dashboardShell";
import StaffManagement from "@/components/dashboard/admin/staffManagement";
import OrdersAnalysis from "@/components/dashboard/admin/ordersAnalysis";
import MenuAnalysis from "@/components/dashboard/admin/menuAnalysis";
import RevenueAnalysis from "@/components/dashboard/admin/revenueAnalysis";

type SectionKey = "staff" | "orders" | "menu" | "revenue";

export default function AdminDashboard() {
  const stats = {
    staff: { total: 12, active: 10, onShift: 8 },
    orders: { today: 32, pending: 6, completed: 26 },
    menu: { total: 48, outOfStock: 3, popular: 12 },
    revenue: { today: 2450, thisWeek: 15200, trend: "+12%" }
  };

  return (
    <DashboardShell<SectionKey>
      title="Restaurant Dashboard"
      subtitle="Overview and analytics"
      cards={[
        {
          key: "staff",
          title: "Staff Management",
          description: "Team & roles",
          icon: <Users className="mx-auto" />,
          count: `${stats.staff.total} Staff`,
          alert: `${stats.staff.onShift} On Shift`
        },
        {
          key: "orders",
          title: "Orders Analytics",
          description: "Order trends & performance",
          icon: <ShoppingCart className="mx-auto" />,
          count: `${stats.orders.today} Today`,
          alert: `${stats.orders.pending} Pending`
        },
        {
          key: "menu",
          title: "Menu Analytics",
          description: "Popular items & inventory",
          icon: <Utensils className="mx-auto" />,
          count: `${stats.menu.total} Items`,
          alert: `${stats.menu.outOfStock} Out of Stock`
        },
        {
          key: "revenue",
          title: "Revenue Analytics",
          description: "Sales & trends",
          icon: <TrendingUp className="mx-auto" />,
          count: `$${stats.revenue.today}`,
          alert: stats.revenue.trend
        }
      ]}
      sections={{
        staff: <StaffManagement />,
        orders: <OrdersAnalysis />,
        menu: <MenuAnalysis />,
        revenue: <RevenueAnalysis />
      }}
    />
  );
}