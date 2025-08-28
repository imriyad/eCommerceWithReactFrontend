import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryProducts = () => {
  const { id } = useParams(); // or use { slug } if you use slugs
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
     useEffect(() => {
      document.title = "ShopEase - Category Products";
    }, []);
  

  useEffect(() => {
    setLoading(true);
    // Use relative URL like the Categories component
    const apiUrl = `/api/categories/${id}/products`;
    
    axios
      .get(apiUrl)
      .then((res) => {
        
        // Handle different possible response structures
        let productsData = [];
        let categoryData = null;
        
        if (res.data && Array.isArray(res.data)) {
          // If response is directly an array of products
          productsData = res.data;
        } else if (res.data && res.data.products) {
          // If response has a products property
          productsData = res.data.products;
        } else if (res.data && res.data.data) {
          // If response has a data property (common in Laravel)
          productsData = res.data.data;
        }
        
        // Handle category data
        if (res.data && res.data.category) {
          categoryData = res.data.category;
        } else if (res.data && res.data.data && res.data.data.category) {
          categoryData = res.data.data.category;
        }
        
        setProducts(productsData || []);
        setCategory(categoryData || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        console.error('Error response:', err.response);
        setError(`Failed to load products for this category. Error: ${err.message}`);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
            {category ? category.name : "Category"} Products
          </h1>
        </div>
        {loading ? (
          <p className="text-indigo-100 text-center">Loading products...</p>
        ) : error ? (
          <p className="text-red-300 text-center">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center">
            <p className="text-indigo-100 text-lg mb-4">No products found in this category.</p>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/90 rounded-3xl shadow-xl p-6 flex flex-col items-center border-t-4 border-b-4 border-transparent hover:border-yellow-400 transition cursor-pointer"
                onClick={() => {
                  navigate(`/product/${product.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                {/* Handle different possible image field names */}
                {(product.image || product.image_url || product.img || product.photo) ? (
                  <img
                    src={`http://localhost:8000/storage/${product.image || product.image_url || product.img || product.photo}`}
                    alt={product.name || product.title || 'Product'}
                    className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-indigo-200"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-200 to-pink-200 mb-4 text-2xl font-bold text-indigo-700">
                    {(product.name || product.title || 'P').charAt(0)}
                  </div>
                )}
                <h2 className="text-xl font-bold text-indigo-900 mb-2 text-center">
                  {product.name || product.title || 'Product Name'}
                </h2>
                <p className="text-gray-600 mb-2 text-center">
                  {product.description || product.desc || 'No description available'}
                </p>
                <span className="text-indigo-700 font-semibold">
                  ${product.price || product.cost || '0.00'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;