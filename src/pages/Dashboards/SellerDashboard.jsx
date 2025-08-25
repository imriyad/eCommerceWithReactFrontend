import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // adjust if needed

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    revenue: 0,
    stock_rate: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const { user } = useAuth(); // get logged-in seller

  useEffect(() => {
    if (!user) return;

    // fetch stats
    axios
      .get("http://localhost:8000/api/seller/stats", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("sellerToken"),
        },
      })
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Failed to load stats:", error));

    // fetch activities
    axios
      .get(`http://localhost:8000/api/seller/recent-activities/${user.id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("sellerToken"),
        },
      })
      .then((response) => setActivities(response.data))
      .catch((error) => console.error("Failed to load activities:", error))
      .finally(() => setLoadingActivities(false));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      <main className="p-8">
        {/* Dashboard Overview */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-indigo-200">Manage your store and sales</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Total Products */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
            <h3 className="text-lg mb-2">Total Products</h3>
            <p className="text-3xl font-bold">{stats.total_products}</p>
            <p className="text-green-300 text-sm mt-1">+8% from last month</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
            <h3 className="text-lg mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold">{stats.total_orders}</p>
            <p className="text-amber-300 text-sm mt-1">+3% this week</p>
          </div>

          {/* Revenue */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
            <h3 className="text-lg mb-2">Revenue</h3>
            <p className="text-3xl font-bold">${stats.revenue}</p>
            <p className="text-green-300 text-sm mt-1">+15% from last month</p>
          </div>

          {/* Stock Rate */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl border border-white border-opacity-20">
            <h3 className="text-lg mb-2">Stock Rate</h3>
            <p className="text-3xl font-bold">{stats.stock_rate}%</p>
            <p className="text-blue-300 text-sm mt-1">Healthy stock</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden">
          <div className="p-6 border-b border-white border-opacity-20">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          {loadingActivities ? (
            <div className="p-4 text-center text-gray-200">
              Loading activities...
            </div>
          ) : activities.length > 0 ? (
            <ul className="divide-y divide-white divide-opacity-20">
              {activities.map((activity) => (
                <li
                  key={activity.id}
                  className="p-4 hover:bg-white hover:bg-opacity-5 transition flex justify-between items-center"
                >
                  <span>{activity.message}</span>
                  <span className="text-xs text-gray-300">
                    {new Date(activity.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-300">
              No recent activity
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h4 className="font-semibold text-indigo-200 mb-4">Quick Actions</h4>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
              Add Product
            </button>
            <button className="flex items-center bg-white text-indigo-700 px-4 py-2 rounded-lg shadow border border-indigo-200 hover:bg-indigo-50 transition">
              View Reports
            </button>
            <button className="flex items-center bg-white text-indigo-700 px-4 py-2 rounded-lg shadow border border-indigo-200 hover:bg-indigo-50 transition">
              Process Orders
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
