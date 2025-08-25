import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiBox,
  FiCreditCard,
  FiMessageSquare,
  FiHelpCircle,
  FiShoppingCart,
  FiStar
} from "react-icons/fi";

const CustomerLayout = ({ showSidebar = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({});

  const sidebarLinks = [
    { title: "Dashboard", icon: <FiHome />, path: "/customer/dashboard" },
    { title: "My Orders", icon: <FiShoppingBag />, path: "/customer/orders" },
    { title: "Wishlist", icon: <FiHeart />, path: "/customer/wishlist" },
    { title: "Payment Methods", icon: <FiCreditCard />, path: "/customer/payments" },
    { title: "Profile", icon: <FiUser />, path: "/customer/profile" },
    { title: "Settings", icon: <FiSettings />, path: "/customer/settings" },
    { title: "Help & Support", icon: <FiHelpCircle />, path: "/customer/support" },
  ];

  useEffect(() => {
    // Get user info from localStorage safely
    const getUserInfo = () => {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        return {};
      }
    };
    
    setUser(getUserInfo());
  }, []);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Don't render sidebar if showSidebar is false
  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800">
        <main className="p-4 lg:p-6">
          <div className="bg-white rounded-2xl shadow-md p-4 lg:p-6 min-h-[calc(100vh-32px)]">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Only show when showSidebar is true */}
      <aside className={`w-64 bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 text-white p-6 flex flex-col fixed h-screen z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-pink-300">
            Customer Portal
          </h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {sidebarLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    navigate(link.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActiveLink(link.path)
                      ? "bg-white text-indigo-900 shadow-lg"
                      : "text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${isActiveLink(link.path) ? "text-indigo-700" : "text-white"}`}>
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.title}</span>
                  </div>
                  {isActiveLink(link.path) && (
                    <FiChevronRight className="text-indigo-700" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="pt-4 border-t border-indigo-400 border-opacity-30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white bg-red-500 bg-opacity-20 hover:bg-red-500 hover:bg-opacity-30 transition-colors duration-200"
          >
            <FiLogOut /> 
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="bg-white rounded-2xl shadow-md p-4 lg:p-6 min-h-[calc(100vh-32px)]">
          {/* Mobile header */}
          <div className="flex justify-between items-center mb-4 lg:mb-6 lg:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-indigo-900">
              {sidebarLinks.find(link => isActiveLink(link.path))?.title || "Dashboard"}
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

export default CustomerLayout;