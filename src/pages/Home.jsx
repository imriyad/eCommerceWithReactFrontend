import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:8000/api/products?page=${page}&search=${encodeURIComponent(search)}`
      );

      if (Array.isArray(res.data)) {
        setProducts(res.data);
        setMeta({ current_page: 1, last_page: 1 });
      } else if (res.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
        setMeta(res.data.meta || { current_page: 1, last_page: 1 });
      } else {
        setError("Unexpected response format from server.");
        setProducts([]);
        setMeta({ current_page: 1, last_page: 1 });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again later.");
      setProducts([]);
      setMeta({ current_page: 1, last_page: 1 });
    }
    setLoading(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= meta.last_page) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Discover Amazing <span className="text-yellow-400">Products</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Shop the latest trends and best deals on thousands of products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 max-w-md mx-auto text-center">
            <p className="text-red-100 font-medium">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <p className="text-xl text-yellow-300">
              {searchQuery ? "No products match your search" : "No products found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-60">
                  <img
                    src={`http://localhost:8000/storage/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.discount_price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round((1 - product.price / product.discount_price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= 4 ? (
                        <FaStar key={star} className="text-yellow-400 w-4 h-4" />
                      ) : (
                        <FaRegStar key={star} className="text-yellow-400 w-4 h-4" />
                      )
                    )}
                    <span className="text-xs text-white/70 ml-1">(124)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-yellow-400">${product.price}</span>
                      {product.discount_price && (
                        <span className="text-sm text-white/70 line-through ml-2">${product.discount_price}</span>
                      )}
                    </div>
                    <button
                      className="text-white/70 hover:text-yellow-400 transition-colors"
                      aria-label="Add to cart"
                    >
                      <FiShoppingCart />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && meta.last_page > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
              let pageNum;
              if (meta.last_page <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= meta.last_page - 2) {
                pageNum = meta.last_page - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentPage === pageNum
                      ? "bg-yellow-400 text-indigo-900 font-bold"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === meta.last_page}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FiShoppingCart className="h-6 w-6 text-yellow-400 mr-2" />
              <span className="text-xl font-bold text-yellow-400">ShopEase</span>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-white/70 hover:text-yellow-400 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-yellow-400 transition-colors"
              >
                Contact
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-yellow-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-yellow-400 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-white/50">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
