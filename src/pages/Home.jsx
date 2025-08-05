import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/products?page=${page}`);
      setProducts(res.data.data);
      setMeta(res.data.meta || res.data); // Laravel's pagination meta
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= meta.last_page) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-6 py-10">
      <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
        Welcome to <span className="text-yellow-300">ShopEase</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {products.map(product => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="bg-white text-indigo-900 rounded-lg shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-transform"
          >
            <img
              src={`http://localhost:8000/storage/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-sm">{product.description}</p>
            <p className="font-semibold mt-2">${product.price}</p>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-10">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold text-lg">
          Page {currentPage} of {meta.last_page}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === meta.last_page}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Auth Buttons */}
      <div className="flex justify-center space-x-6 mt-12">
        <Link to="/login">
          <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="px-8 py-3 bg-transparent border-2 border-yellow-400 hover:bg-yellow-400 hover:text-indigo-900 font-semibold rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            Register
          </button>
        </Link>
      </div>

      <footer className="mt-20 text-yellow-200 text-sm opacity-75 text-center">
        &copy; 2025 ShopEase. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
