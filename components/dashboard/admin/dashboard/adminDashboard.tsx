"use client";
import { useQuery } from "@tanstack/react-query";
import { Users, ShoppingCart, Utensils, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/admin/dashboard/dashboardShell";
import StaffManagement from "@/components/dashboard/admin/dashboard/staffManagement";
import OrdersAnalysis from "@/components/dashboard/admin/dashboard/ordersAnalysis";
import MenuAnalysis from "@/components/dashboard/admin/dashboard/menuAnalysis";
import RevenueAnalysis from "@/components/dashboard/admin/dashboard/revenueAnalysis";
import { UsersBoxSkeleton } from "../../../common/skeleton";
import { SectionKey} from "@/types";
import { dashboardApi } from "@/lib/api";
import { useNetworkError } from "@/hooks/useNetworkError";

export default function AdminDashboard() {
  const { data: stats, isLoading , isError, error} = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000,
    staleTime: 10000
  });
  useNetworkError(!!isError, error, 'Failed to load dashboard stats');
  if (isLoading) {
    return (
      <UsersBoxSkeleton/>
    );
  }
  // ✅ Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">Error loading dashboard</p>
          <p className="mt-2">{error.message}</p>
        </div>
      </div>
    );
  }
  if (!stats) {
    return null;
  }

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
          count: `${stats?.staff?.total} Staff`,
          alert: `${stats?.staff?.active} Active`
        },
        {
          key: "orders",
          title: "Orders Analytics",
          description: "Order trends & performance",
          icon: <ShoppingCart className="mx-auto" />,
          count: `${stats?.orders?.today} Today`,
          alert: `${stats?.orders?.pending} Pending`
        },
        {
          key: "menu",
          title: "Menu Analytics",
          description: "Popular items & inventory",
          icon: <Utensils className="mx-auto" />,
          count: `${stats?.menu?.total} Items`,
          alert: `${stats?.menu?.outOfStock} Out of Stock`
        },
        {
          key: "revenue",
          title: "Revenue Analytics",
          description: "Sales & trends",
          icon: <TrendingUp className="mx-auto" />,
          count: `$${stats?.revenue?.today}`,
          alert: stats?.revenue?.trend
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