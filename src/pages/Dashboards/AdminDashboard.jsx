import React from "react";
import { FiUsers, FiShoppingCart, FiBarChart2 } from "react-icons/fi";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <FiUsers className="text-blue-600 text-3xl" />
            <div>
              <h2 className="text-lg font-semibold">Users</h2>
              <p className="text-gray-500">120</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <FiShoppingCart className="text-green-600 text-3xl" />
            <div>
              <h2 className="text-lg font-semibold">Orders</h2>
              <p className="text-gray-500">85</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <FiBarChart2 className="text-purple-600 text-3xl" />
            <div>
              <h2 className="text-lg font-semibold">Sales</h2>
              <p className="text-gray-500">$4,560</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="border-b pb-2">🛒 Order #1234 placed by John Doe</li>
          <li className="border-b pb-2">👤 New user registered: Sarah</li>
          <li className="border-b pb-2">📈 Sales report updated</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
