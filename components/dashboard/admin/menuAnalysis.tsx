// components/dashboard/admin/menuAnalysis.tsx
"use client";

export default function MenuAnalysis() {
  const popularItems = [
    { name: "Margherita Pizza", orders: 45, revenue: 675 },
    { name: "Chicken Burger", orders: 38, revenue: 570 },
    { name: "Caesar Salad", orders: 32, revenue: 384 },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Menu Analytics</h2>
      
      {/* Popular Items */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
        <div className="space-y-4">
          {popularItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{item.orders} orders this week</p>
              </div>
              <p className="text-lg font-bold text-green-600">${item.revenue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Inventory Alerts</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded">
            <span className="text-red-800">Pasta - Out of Stock</span>
            <button className="text-sm text-blue-600 hover:underline">Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}