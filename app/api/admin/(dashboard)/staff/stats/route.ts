import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get week start for revenue trend
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    // 1. STAFF STATS
    const { data: allStaff } = await supabase
      .from('staff')
      .select('id, is_active');
    
    const staffTotal = allStaff?.length || 0;
    const staffActive = allStaff?.filter(s => s.is_active).length || 0;
    

    // 2. ORDERS STATS
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('id, status')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());
    
    const ordersToday = todayOrders?.length || 0;
    const ordersPending = todayOrders?.filter(o => 
      o.status === 'pending' || o.status === 'preparing'
    ).length || 0;
    const ordersCompleted = todayOrders?.filter(o => 
      o.status === 'completed'
    ).length || 0;

    // 3. MENU STATS
    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('id, is_available, stock_quantity');
    
    const menuTotal = menuItems?.length || 0;
    const menuOutOfStock = menuItems?.filter(item => 
      !item.is_available || item.stock_quantity === 0
    ).length || 0;
    
    // Get popular items (most ordered)
    const { data: popularItems } = await supabase
      .from('order_items') // or wherever you track order details
      .select('menu_item_id')
      .gte('created_at', weekStart.toISOString());
    
    // Count occurrences and get top items
    const itemCounts = popularItems?.reduce((acc, item) => {
      acc[item.menu_item_id] = (acc[item.menu_item_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};
    
    const menuPopular = Object.keys(itemCounts).length;

    // 4. REVENUE STATS
    const { data: todayRevenue } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());
    
    const revenueToday = todayRevenue?.reduce((sum, order) => 
      sum + (order.total_amount || 0), 0
    ) || 0;

    const { data: weekRevenue } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('status', 'completed')
      .gte('created_at', weekStart.toISOString());
    
    const revenueThisWeek = weekRevenue?.reduce((sum, order) => 
      sum + (order.total_amount || 0), 0
    ) || 0;

    // Calculate last week's revenue for trend
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(weekStart.getDate() - 7);
    
    const { data: lastWeekRevenue } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('created_at', lastWeekStart.toISOString())
      .lt('created_at', weekStart.toISOString());
    
    const revenueLastWeek = lastWeekRevenue?.reduce((sum, order) => 
      sum + (order.total_amount || 0), 0
    ) || 0;

    const revenueTrend = revenueLastWeek > 0 
      ? `${((revenueThisWeek - revenueLastWeek) / revenueLastWeek * 100).toFixed(0)}%`
      : "+0%";

    // RETURN ALL STATS
    return NextResponse.json({
      success: true,
      staff: {
        total: staffTotal,
        active: staffActive,
      },
      orders: {
        today: ordersToday,
        pending: ordersPending,
        completed: ordersCompleted
      },
      menu: {
        total: menuTotal,
        outOfStock: menuOutOfStock,
        popular: menuPopular
      },
      revenue: {
        today: revenueToday,
        thisWeek: revenueThisWeek,
        trend: revenueTrend
      }
    });

  } catch (error: unknown) {
    console.error('Stats error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
}