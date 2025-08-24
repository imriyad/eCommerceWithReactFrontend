import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiTag,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiHome,
  FiMenu,
  FiX,
  FiChevronRight,
} from "react-icons/fi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar links (Logout uses action instead of path)
  const sidebarLinks = [
    { title: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
    { title: "Products", icon: <FiPackage />, path: "/admin/products" },
    { title: "Users", icon: <FiUsers />, path: "/admin/users" },
    { title: "Orders", icon: <FiShoppingBag />, path: "/admin/orders" },
    { title: "Promotions", icon: <FiTag />, path: "/admin/promotions" },
    { title: "Reports", icon: <FiBarChart2 />, path: "/admin/reports" },
    { title: "Settings", icon: <FiSettings />, path: "/admin/settings" },
    { title: "Logout", icon: <FiLogOut />, action: "logout" }, // special case
  ];

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = () => {
    // ✅ Clear session/local storage (adjust for your auth system)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // If you use context for auth:
    // setAuth(null);

    // ✅ Redirect to login
    navigate("/login", { replace: true });
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

      {/* Sidebar */}
      <aside
        className={`w-64 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 text-white p-6 flex flex-col fixed h-screen z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-pink-300">
            Admin Panel
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
            {sidebarLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    if (link.action === "logout") {
                      handleLogout(); 
                    } else {
                      navigate(link.path);
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    link.path && isActiveLink(link.path)
                      ? "bg-white text-indigo-900 shadow-lg"
                      : "text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg ${
                        link.path && isActiveLink(link.path)
                          ? "text-indigo-700"
                          : "text-white"
                      }`}
                    >
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.title}</span>
                  </div>
                  {link.path && isActiveLink(link.path) && (
                    <FiChevronRight className="text-indigo-700" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
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
              {sidebarLinks.find(
                (link) => link.path && isActiveLink(link.path)
              )?.title || "Dashboard"}
            </h2>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>

          {/* This will render the child page */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
