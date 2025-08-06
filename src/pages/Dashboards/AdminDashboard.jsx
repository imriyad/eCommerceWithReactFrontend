import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white p-8">

      <div className="max-w-6xl mx-auto p-8 pt-24"> {/* pt-24 for navbar offset */}
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Admin Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => navigate("/admin/products")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Product Management
          </button>

          <button
            onClick={() => navigate("/admin/users")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            User Management
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Order Management
          </button>

          <button
            onClick={() => navigate("/admin/promotions")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Promotions & Discounts
          </button>

          <button
            onClick={() => navigate("/admin/reports")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
          >
            Reports & Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
