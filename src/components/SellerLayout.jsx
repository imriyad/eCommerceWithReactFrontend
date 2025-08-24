import React, { useState } from "react";
import {
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiArchive,
  FiUser,
  FiHome,
  FiChevronRight
} from "react-icons/fi";
import { Outlet, useNavigate } from "react-router-dom";

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <FiHome size={20} />, path: "/seller/dashboard" },
    { id: "products", name: "Manage Products", icon: <FiBox size={20} />, path: "/seller/products" },
    { id: "addProducts", name: "Add New Product", icon: <FiPlusCircle size={20} />, path: "/seller/addProducts" },
    { id: "orders", name: "Manage Orders", icon: <FiShoppingCart size={20} />, path: "/seller/orders" },
    { id: "inventory", name: "Inventory", icon: <FiArchive size={20} />, path: "/seller/inventory" },
    { id: "reports", name: "Sales Reports", icon: <FiBarChart2 size={20} />, path: "/seller/reports" },
    { id: "profile", name: "Profile", icon: <FiUser size={20} />, path: "/seller/profile" },
    { id: "settings", name: "Settings", icon: <FiSettings size={20} />, path: "/seller/settings" },
  ];

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerData");
    
    // Redirect to login (in a real app, you would use react-router navigation)
    alert("Logging out...");
  };

  const handleNavigation = (itemId, itemPath) => {
    setActiveItem(itemId);
    navigate(itemPath);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (fixed to left) */}
      <aside
        className={`w-64 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 text-white p-6 flex flex-col fixed left-0 h-screen z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-pink-300">
            Seller Portal
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id, item.path)}
                  className={`flex items-center justify-between gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeItem === item.id
                      ? "bg-white text-indigo-900 shadow-lg"
                      : "text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg ${
                        activeItem === item.id
                          ? "text-indigo-700"
                          : "text-white"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {activeItem === item.id && (
                    <FiChevronRight className="text-indigo-700" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="mt-auto pt-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-white transition-all duration-200"
          >
            <FiLogOut className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content (margin left for sidebar) */}
      <main className="flex-1 lg:ml-64 p-6">
        <div className="bg-white rounded-2xl shadow-md p-6 min-h-[calc(100vh-48px)]">
          {/* Mobile header */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-indigo-100 text-indigo-900"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-indigo-900">
              {menuItems.find(item => item.id === activeItem)?.name || "Dashboard"}
            </h2>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>

          {/* Content area */}
          <div className="p-4">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;