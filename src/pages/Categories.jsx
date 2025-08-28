import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

   useEffect(() => {
    document.title = "ShopEase-Categories";
  }, []);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load categories");
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-12 px-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              width: Math.random() * 200 + 50 + "px",
              height: Math.random() * 200 + 50 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              background: `radial-gradient(circle, ${i % 3 === 0 ? 'rgba(255,215,0,0.3)' : i % 3 === 1 ? 'rgba(255,105,180,0.3)' : 'rgba(147,112,219,0.3)'})`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              animationName: 'float'
            }}
          />
        ))}
      </div>

      {/* Animated particles */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 2 + "px",
              height: Math.random() * 5 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              background: `rgba(255, 255, 255, ${Math.random() * 0.5})`,
              animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-16 text-center relative">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          
          <h1 className="text-5xl md:text-4xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in-down bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            Explore Categories
          </h1>
          
          <p className="text-xl text-indigo-200 mb-6 max-w-2xl mx-auto leading-relaxed">
            Discover products organized by category and find your new favorites!
          </p>
          
          <div className="w-40 h-1.5 mx-auto bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 rounded-full mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-indigo-400 animate-shimmer"></div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full py-3 px-6 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <button 
                className="relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg leading-none flex items-center text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                onClick={() => navigate('/')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="w-20 h-20 border-t-4 border-b-4 border-yellow-400 rounded-full animate-spin"></div>
              <div className="w-20 h-20 border-r-4 border-l-4 border-pink-400 rounded-full animate-spin-reverse absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold">Loading...</span>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md mx-auto border border-red-400/30 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-100 text-xl font-medium mb-4">{error}</p>
            <button 
              className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-400 hover:to-pink-400 transition-all duration-300 shadow-md"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-indigo-800/30 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md mx-auto border border-indigo-400/30 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-indigo-100 text-xl font-medium mb-2">No categories found.</p>
            <p className="text-indigo-200">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className="relative bg-gradient-to-br from-white/95 to-white/90 rounded-3xl shadow-2xl p-6 flex flex-col items-center transition-all duration-700 transform hover:-translate-y-4 hover:shadow-2xl group cursor-pointer overflow-hidden"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transitionDelay: `${index * 0.05}s`
                }}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/categories/${category.id}/products`)}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Category Image */}
                <div className="relative mb-6 z-10">
                  {category.image ? (
                    <div className="relative">
                      <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full opacity-70 blur group-hover:opacity-100 group-hover:blur-xl transition-all duration-500"></div>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-28 h-28 object-cover rounded-full relative z-10 border-4 border-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-300 to-pink-300 text-4xl font-bold text-indigo-800 shadow-lg group-hover:from-yellow-300 group-hover:to-pink-400 transition-all duration-500">
                      {category.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-indigo-900 mb-3 text-center transition-colors group-hover:text-indigo-700 z-10">
                  {category.name}
                </h2>
                
                <p className="text-gray-600 text-sm text-center mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  Click to explore products
                </p>
                
                <div className="mt-auto w-full z-10">
                  <div className="h-1 w-0 bg-gradient-to-r from-yellow-400 to-pink-500 mx-auto group-hover:w-full transition-all duration-700 rounded-full"></div>
                </div>
                
                {/* Floating particles on hover */}
                {hoveredCard === category.id && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-yellow-400 opacity-70 z-0"
                        style={{
                          top: `${Math.random() * 60 + 20}%`,
                          left: `${Math.random() * 80 + 10}%`,
                          animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </>
                )}
                
                {/* View more button that appears on hover */}
                <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-indigo-200/70 text-sm">
        <p>© {new Date().getFullYear()} Your Brand Name. All rights reserved.</p>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-spin-reverse {
          animation: spin 1.5s linear infinite reverse;
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Categories;