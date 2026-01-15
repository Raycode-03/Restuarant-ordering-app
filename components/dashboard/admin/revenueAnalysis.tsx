// components/dashboard/admin/revenueAnalysis.tsx
"use client";

export default function RevenueAnalysis() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revenue Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-3xl font-bold">$2,450</p>
          <p className="text-sm text-green-600">+12% from yesterday</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-3xl font-bold">$15,200</p>
          <p className="text-sm text-green-600">+8% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-3xl font-bold">$58,900</p>
          <p className="text-sm text-gray-600">On track</p>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}