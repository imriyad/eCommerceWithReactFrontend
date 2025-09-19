import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    revenue: 0,
    stock_rate: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "ShopEase - Seller Dashboard";
    if (!user) return;

    // Fetch stats
    axios
      .get("http://localhost:8000/api/seller/stats", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("sellerToken"),
        },
      })
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Failed to load stats:", error));

    // Fetch activities
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <main className="p-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Manage your store and track performance.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Products Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.total_products}</p>
                <p className="text-green-500 text-xs mt-1">+8% from last month</p>
              </div>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.total_orders}</p>
                <p className="text-amber-500 text-xs mt-1">+3% this week</p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                <p className="text-2xl font-bold text-gray-800">${stats.revenue}</p>
                <p className="text-green-500 text-xs mt-1">+15% from last month</p>
              </div>
            </div>
          </div>

          {/* Stock Rate Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Stock Rate</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.stock_rate}%</p>
                <p className="text-blue-500 text-xs mt-1">Healthy stock level</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
              <p className="text-sm text-gray-500">Latest actions in your store</p>
            </div>

            {loadingActivities ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-gray-600">Loading activities...</span>
                </div>
              </div>
            ) : activities.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-1">
                          <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-800">{activity.message}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-4 text-gray-500">No recent activity to show</p>
              </div>
            )}
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link to="/seller/addProducts">
                <button className="w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-3 rounded-lg shadow hover:bg-indigo-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
              </Link>
              
              <Link to="/seller/orders">
              <button className="mt-4 w-full flex items-center justify-center bg-white text-indigo-700 px-4 py-3 rounded-lg shadow border border-indigo-200 hover:bg-indigo-50 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Process Orders
              </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;