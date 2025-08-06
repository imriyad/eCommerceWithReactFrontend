import React from "react";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white p-8">
      <h1 className="text-4xl font-extrabold mb-12 text-center">Seller Dashboard</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Product Management */}
        <button
          onClick={() => navigate("/seller/products")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Manage Products
        </button>

        <button
          onClick={() => navigate("/seller/addProducts")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Add New Product
        </button>

        {/* Order Management */}
        <button
          onClick={() => navigate("/seller/orders")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Manage Orders
        </button>

        {/* Inventory Management */}
        <button
          onClick={() => navigate("/seller/inventory")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Inventory Management
        </button>

        {/* Sales Reports */}
        <button
          onClick={() => navigate("/seller/reports")}
          className="bg-yellow-400 text-indigo-900 font-bold py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition"
        >
          Sales Reports
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;
