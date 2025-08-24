import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_users: 0,
    total_orders: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/admin/stats")
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Failed to load stats:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      {/* Main Content */}
      <main className="p-8">
        {/* Dashboard Overview */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-indigo-200">Manage your e-commerce platform</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
            <h3 className="text-lg mb-2">Total Products</h3>
            <p className="text-3xl font-bold">{stats.total_products}</p>
            <p className="text-green-300 text-sm mt-1">+12% from last month</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
            <h3 className="text-lg mb-2">Active Users</h3>
            <p className="text-3xl font-bold">{stats.total_users}</p>
            <p className="text-green-300 text-sm mt-1">+5% from last week</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
            <h3 className="text-lg mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold">{stats.total_orders}</p>
            <p className="text-amber-300 text-sm mt-1">-8% from yesterday</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden">
          <div className="p-6 border-b border-white border-opacity-20">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-white divide-opacity-20">
            {[
              "New order #12345 placed by John Doe",
              "User Sarah Johnson updated their profile",
              "Product 'Wireless Headphones' stock updated",
              "New promotion 'SUMMER25' created",
              "System backup completed",
            ].map((activity, i) => (
              <li
                key={i}
                className="p-4 hover:bg-white hover:bg-opacity-5 transition"
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
