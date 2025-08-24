import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    revenue: 0,
    stock_rate: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/seller/stats", {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('sellerToken'),
        },
      })
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Failed to load stats:", error));
  }, []);

  return (
    <>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl shadow">
          <div className="text-indigo-800 font-bold text-2xl">{stats.total_products}</div>
          <div className="text-gray-600">Total Products</div>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl shadow">
          <div className="text-indigo-800 font-bold text-2xl">{stats.total_orders}</div>
          <div className="text-gray-600">Pending Orders</div>
        </div>
        <div className="bg-gradient-to-r from-pink-100 to-indigo-100 p-4 rounded-xl shadow">
          <div className="text-indigo-800 font-bold text-2ml">${stats.revenue}</div>
          <div className="text-gray-600">Revenue</div>
        </div>
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl shadow">
          <div className="text-indigo-800 font-bold text-2xl">{stats.stock_rate}%</div>
          <div className="text-gray-600">Stock Rate</div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow mb-8">
        <h4 className="font-semibold text-indigo-800 mb-4">Recent Activity</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                {/* Icon */}
              </div>
              <div>
                <p className="font-medium">New order received</p>
                <p className="text-sm text-gray-500">Order #ORD-4782</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                {/* Icon */}
              </div>
              <div>
                <p className="font-medium">Product restocked</p>
                <p className="text-sm text-gray-500">Wireless Headphones</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                {/* Icon */}
              </div>
              <div>
                <p className="font-medium">Monthly report generated</p>
                <p className="text-sm text-gray-500">June 2023 Sales</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h4 className="font-semibold text-indigo-800 mb-4">Quick Actions</h4>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
            {/* Icon */}
            Add Product
          </button>
          <button className="flex items-center bg-white text-indigo-700 px-4 py-2 rounded-lg shadow border border-indigo-200 hover:bg-indigo-50 transition">
            {/* Icon */}
            View Reports
          </button>
          <button className="flex items-center bg-white text-indigo-700 px-4 py-2 rounded-lg shadow border border-indigo-200 hover:bg-indigo-50 transition">
            {/* Icon */}
            Process Orders
          </button>
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;