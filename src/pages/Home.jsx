import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex flex-col items-center justify-center px-6 text-white">
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg text-center">
        Welcome to <span className="text-yellow-300">ShopEase</span>
      </h1>
      <p className="max-w-xl text-center mb-10 text-lg font-medium drop-shadow-md">
        Experience seamless shopping like never before. Explore the best products, enjoy exclusive deals, and manage your orders effortlessly.
      </p>
      <div className="flex space-x-6">
        <Link to="/login">
          <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="px-8 py-3 bg-transparent border-2 border-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            Register
          </button>
        </Link>
      </div>
      <footer className="mt-20 text-yellow-200 text-sm opacity-75">
        &copy; 2025 ShopEase. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
