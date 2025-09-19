import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiSettings,
  FiBarChart2,
  FiTag
} from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { AuthContext, useAuth } from "../context/AuthContext";
import debounce from "lodash.debounce";
import axios from "axios";

const Navbar = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const { role } = useAuth(); // assuming role comes from AuthContext or useAuth
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Refs
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Load all products for local search
  useEffect(() => {
    axios.get("/api/products").then((res) => setAllProducts(res.data));
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setSuggestions(allProducts.slice(0, 5));
        return;
      }
      const words = query.toLowerCase().split(/\s+/);
      const matched = allProducts.filter((p) =>
        words.some((word) => p.name.toLowerCase().includes(word))
      );
      setSuggestions(matched.length > 0 ? matched.slice(0, 5) : allProducts.slice(0, 5));
    }, 300),
    [allProducts]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (name) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    if (onSearch) onSearch(name);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/login");
  };

  // Close Account Dropdown on outside click
  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, []);

  // Close Search Suggestions on outside click
  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-purple-800 text-white fixed w-full z-20 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <FiShoppingCart className="h-6 w-6 text-yellow-400 mr-2" />
            <span className="text-xl font-bold text-yellow-400">ShopEase</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 mx-4">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/special-offers" className="text-yellow-400 hover:text-yellow-300 font-bold flex items-center">
              <FiTag className="mr-1 h-4 w-4" /> Special Offers
            </Link>
            <Link to="/categories" className="hover:text-yellow-400 transition-colors">Categories</Link>
          </div>

          {/* Search Bar */}
          <form ref={searchRef} onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 pr-10 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="absolute right-3 top-2.5 text-white/70 hover:text-white">
                <FaSearch />
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-white text-black rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
                {suggestions.map((product) => (
                  <li key={product.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(product.name)}>
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* Right Menu */}
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative text-yellow-400 hover:text-yellow-300">
              <FiShoppingCart className="h-6 w-6" />
            </Link>
            <Link to="/checkout" className="text-yellow-400 hover:text-yellow-300 font-medium hidden sm:inline">
              Checkout
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {/* Profile Avatar */}
                  {user.profile_picture ? (
                    <img
                      src={`http://localhost:8000/storage/${user.profile_picture}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />

                  ) : (
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-indigo-900 font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="hidden md:inline-block text-yellow-300 font-medium cursor-pointer">
                    {user.name || user.email}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                    <Link
                      to={`/${role}/dashboard`}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiBarChart2 className="mr-2" /> Dashboard
                    </Link>

                    <Link
                      to="/account"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FiSettings className="mr-2" /> Account Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 rounded-full font-medium text-sm transition-colors">
                    <FiLogIn className="h-4 w-4" /> <span>Login</span>
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
