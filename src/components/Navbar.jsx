import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogIn, FiLogOut, FiSettings } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import {AuthContext,AuthProvider, useAuth} from '../context/AuthContext';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
<nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-800 text-white fixed w-full z-20 border-b border-white/10 backdrop-blur-md">


      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <FiShoppingCart className="h-6 w-6 text-yellow-400 mr-2" />
            <span className="text-xl font-bold text-yellow-400">ShopEase</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-2.5 text-white/70 hover:text-white">
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Right Menu */}
          <div className="flex items-center space-x-6">
            {/* Cart and Checkout */}
            <Link to="/cart" className="relative text-yellow-400 hover:text-yellow-300">
              <FiShoppingCart className="h-6 w-6" />
              {/* Badge for cart count can be added here */}
            </Link>
            <Link
              to="/checkout"
              className="text-yellow-400 hover:text-yellow-300 font-medium hidden sm:inline"
            >
              Checkout
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <FiUser className="text-yellow-400 h-6 w-6" />
                  <span className="hidden md:inline-block text-yellow-300 font-medium cursor-pointer">
                    {user.name || user.email}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiSettings className="mr-2" />
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 rounded-full font-medium text-sm transition-colors">
                    <FiLogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                </Link>
                <Link to="/register">
                  <button className="flex items-center space-x-1 px-3 py-1.5 border border-yellow-400 hover:bg-yellow-400/20 text-yellow-400 rounded-full font-medium text-sm transition-colors">
                    <span>Register</span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
