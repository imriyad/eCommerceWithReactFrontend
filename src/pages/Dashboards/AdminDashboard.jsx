import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <button
          onClick={() => navigate("/admin/addProducts")}
          className="p-6 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Product Management
        </button>

        <button
          onClick={() => navigate("/admin/users")}
          className="p-6 bg-green-600 text-white rounded shadow hover:bg-green-700 transition"
        >
          User Management
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className="p-6 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700 transition"
        >
          Order Management
        </button>

        <button
          onClick={() => navigate("/admin/promotions")}
          className="p-6 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
        >
          Promotions & Discounts
        </button>

        <button
          onClick={() => navigate("/admin/reports")}
          className="p-6 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
        >
          Reports & Analytics
        </button>

        {/* Add more buttons as needed */}
      </div>
    </div>
  );
};

export default AdminDashboard;
