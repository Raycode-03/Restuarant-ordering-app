// components/dashboard/admin/ordersAnalysis.tsx
"use client";

export default function OrdersAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders Analytics</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Today&apos;s Orders</p>
          <p className="text-2xl font-bold">32</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">26</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-orange-600">6</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Avg Time</p>
          <p className="text-2xl font-bold">18 min</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Orders Over Time</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>12:00 PM - 1:00 PM</span>
            <span className="font-semibold">15 orders</span>
          </div>
          <div className="flex justify-between items-center">
            <span>7:00 PM - 8:00 PM</span>
            <span className="font-semibold">12 orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}