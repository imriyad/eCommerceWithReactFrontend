import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { 
  FiPackage, 
  FiUsers, 
  FiShoppingBag, 
  FiTag, 
  FiBarChart2,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    total_products: 0,
    total_users: 0,
    total_orders:0,
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Failed to load stats:', error));
  }, []);


  const navigate = useNavigate();

  const adminCards = [
    {
      title: "Product Management",
      icon: <FiPackage className="text-3xl" />,
      path: "/admin/products",
      bgColor: "bg-gradient-to-r from-amber-400 to-amber-500",
      hoverColor: "hover:from-amber-500 hover:to-amber-600"
    },
    {
      title: "User Management",
      icon: <FiUsers className="text-3xl" />,
      path: "/admin/users",
      bgColor: "bg-gradient-to-r from-emerald-400 to-emerald-500",
      hoverColor: "hover:from-emerald-500 hover:to-emerald-600"
    },
    {
      title: "Order Management",
      icon: <FiShoppingBag className="text-3xl" />,
      path: "/admin/orders",
      bgColor: "bg-gradient-to-r from-blue-400 to-blue-500",
      hoverColor: "hover:from-blue-500 hover:to-blue-600"
    },
    {
      title: "Promotions & Discounts",
      icon: <FiTag className="text-3xl" />,
      path: "/admin/promotions",
      bgColor: "bg-gradient-to-r from-purple-400 to-purple-500",
      hoverColor: "hover:from-purple-500 hover:to-purple-600"
    },
    {
      title: "Reports & Analytics",
      icon: <FiBarChart2 className="text-3xl" />,
      path: "/admin/reports",
      bgColor: "bg-gradient-to-r from-rose-400 to-rose-500",
      hoverColor: "hover:from-rose-500 hover:to-rose-600"
    },
    {
      title: "System Settings",
      icon: <FiSettings className="text-3xl" />,
      path: "/admin/settings",
      bgColor: "bg-gradient-to-r from-gray-400 to-gray-500",
      hoverColor: "hover:from-gray-500 hover:to-gray-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      {/* Header/Navbar */}
      <header className="bg-black bg-opacity-30 backdrop-blur-md p-4 fixed w-full z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          {/* <button 
            onClick={() => navigate("/logout")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
          >
            <FiLogOut /> Logout
          </button> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8 pt-24"> {/* pt-24 to offset fixed header */}
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

        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.bgColor} ${card.hoverColor} text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-4 h-full`}
            >
              {card.icon}
              <span className="text-xl font-semibold">{card.title}</span>
            </button>
          ))}
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
              "System backup completed"
            ].map((activity, i) => (
              <li key={i} className="p-4 hover:bg-white hover:bg-opacity-5 transition">
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