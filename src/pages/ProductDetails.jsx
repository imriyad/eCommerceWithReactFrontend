import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { FaStar, FaRegStar, FaCheck } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [specs, setSpecs] = useState({});
  const { user } = useAuth();
  const customerId = user?.id;
  const [inWishlist, setInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch main product
        const productRes = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(productRes.data);
        
        // Process specifications
        if (productRes.data.specifications) {
          const spec = productRes.data.specifications;
          if (typeof spec === "string") {
            try {
              const parsed = JSON.parse(spec);
              setSpecs(typeof parsed === "object" ? parsed : { General: spec });
            } catch {
              setSpecs({ General: spec });
            }
          } else if (typeof spec === "object") {
            setSpecs(spec);
          }
        }

        // Set default selections
        if (productRes.data.color) setSelectedColor(productRes.data.color);
        if (productRes.data.size) setSelectedSize(productRes.data.size);

        // Fetch potential related products
        setLoadingRelated(true);
        const allProductsRes = await axios.get("http://localhost:8000/api/products");
        
        // Filter related products (same category or same brand, excluding current)
        const related = allProductsRes.data.filter(p => 
          p.id !== productRes.data.id && 
          (p.category_id === productRes.data.category_id || 
           p.brand === productRes.data.brand)
        )
        
        setRelatedProducts(related);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
        setLoadingRelated(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock || 10));
    setQuantity(newQuantity);
  };

  const handleWishlistToggle = async () => {
    if (!customerId) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");
      const endpoint = inWishlist ? 
        `http://localhost:8000/api/wishlist/${product.id}` : 
        "http://localhost:8000/api/wishlist";
      
      const res = inWishlist ? 
        await axios.delete(endpoint, { data: { customer_id: customerId } }) :
        await axios.post(endpoint, { customer_id: customerId, product_id: product.id });

      alert(res.data.message || (inWishlist ? "Removed from wishlist" : "Added to wishlist"));
      setInWishlist(!inWishlist);
    } catch (err) {
      alert(err.response?.data?.message || "Wishlist operation failed");
    }
  };

  const handleAddToCart = async () => {
    if (!customerId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");
      const response = await axios.post("http://localhost:8000/api/cart", {
        customer_id: customerId,
        product_id: product.id,
        quantity,
        color: selectedColor,
        size: selectedSize,
      });

      alert(response.data.message || `${quantity} × ${product.name} added to cart`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

 const handleBuyNow = () => {
  navigate("/checkout", { state: { buyNowProduct: { product, quantity } } });
  window.scrollTo(0, 0);
};

  const navigateToProduct = (productId) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto shadow-lg">
          <p className="font-bold text-xl mb-2">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Main Product Section */}
        <div className="grid md:grid-cols-2 gap-10 p-10">
          {/* Product Image */}
          <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6 shadow-inner hover:shadow-lg transition-shadow duration-300">
            <img
              src={product.image ? `http://localhost:8000/storage/${product.image}` : "https://via.placeholder.com/600x600?text=No+Image"}
              alt={product.name}
              className="w-full max-h-[460px] object-contain rounded-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{product.name}</h1>
              <div className="flex items-center mt-4 space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => i < 4 ? <FaStar key={i} className="w-6 h-6" /> : <FaRegStar key={i} className="w-6 h-6" />)}
                </div>
                <span className="ml-3 text-gray-500 font-medium">(1247 reviews)</span>
              </div>
              {product.brand && <p className="mt-3 text-gray-600 text-lg">Brand: <span className="text-indigo-700 font-semibold">{product.brand}</span></p>}
            </div>

            {/* Price Section */}
            <div>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-extrabold text-indigo-900">${product.price}</span>
                {product.discount_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${product.discount_price}</span>
                    <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded-full shadow">
                      {Math.round((1 - product.price / product.discount_price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className={`mt-2 text-lg font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `${product.stock} items in stock` : "Out of stock"}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Description</h3>
                <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Color Selection */}
            {product.color && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Color</h3>
                <div className="inline-flex items-center space-x-3 bg-indigo-50 rounded-full px-5 py-3">
                  <span className="text-indigo-800 font-semibold">{product.color}</span>
                  <FaCheck className="text-green-500 w-6 h-6" />
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.size && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Size</h3>
                <div className="inline-flex items-center space-x-3 bg-indigo-50 rounded-full px-5 py-3">
                  <span className="text-indigo-800 font-semibold">{product.size}</span>
                  <FaCheck className="text-green-500 w-6 h-6" />
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)} 
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={quantity <= 1}
                >
                  <FiMinus className="w-6 h-6 text-gray-600" />
                </button>
                <span className="px-8 py-3 bg-white text-xl font-semibold">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)} 
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <FiPlus className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mt-8">
              <button 
                onClick={handleBuyNow} 
                disabled={product.stock === 0}
                className="flex-1 bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Buy Now
              </button>
              <button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <FiShoppingCart className="w-6 h-6" /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Button */}
        {/* <div className="flex justify-center mt-5">
          <button
            onClick={handleWishlistToggle}
            className={`inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition ${
              inWishlist ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {inWishlist ? <FaHeart className="text-white" /> : <FiHeart className="text-white" />}
            {inWishlist ? "In Wishlist" : "Add to Wishlist"}
          </button>
        </div> */}

        {/* Specifications */}
        {Object.keys(specs).length > 0 && (
          <div className="border-t border-gray-200 px-10 py-8 bg-gray-50 rounded-b-3xl mt-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-indigo-700 text-lg">{key}</h4>
                  <p className="mt-2 text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
       <div className="px-10 py-8 bg-white">
  <h3 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h3>
  
  {loadingRelated ? (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  ) : relatedProducts.length > 0 ? (
    <div className="relative">
      <div className="flex items-center">
        {/* Left Navigation Button */}
        <button 
          className="hidden md:block absolute left-0 z-10 p-2 -ml-4 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          onClick={() => {
            const container = document.querySelector('.related-products-container');
            if (container.scrollLeft <= 10) {
              // If at start, scroll to end
              container.scrollTo({ 
                left: container.scrollWidth - container.clientWidth, 
                behavior: 'smooth' 
              });
            } else {
              // Normal scroll left
              container.scrollBy({ 
                left: -300, 
                behavior: 'smooth' 
              });
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Products Container */}
        <div className="related-products-container flex space-x-6 overflow-x-auto pb-6 scrollbar-hide w-full">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              onClick={() => navigateToProduct(relatedProduct.id)}
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={relatedProduct.image ? `http://localhost:8000/storage/${relatedProduct.image}` : "https://via.placeholder.com/300x300?text=No+Image"}
                  alt={relatedProduct.name}
                  className="h-full object-contain"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-1 truncate">{relatedProduct.name}</h4>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => i < 4 ? <FaStar key={i} className="w-4 h-4" /> : <FaRegStar key={i} className="w-4 h-4" />)}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">(24)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-indigo-700">${relatedProduct.price}</span>
                  {relatedProduct.discount_price && (
                    <span className="ml-2 text-sm text-gray-400 line-through">${relatedProduct.discount_price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Navigation Button */}
        <button 
          className="hidden md:block absolute right-0 z-10 p-2 -mr-4 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          onClick={() => {
            const container = document.querySelector('.related-products-container');
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
              // If at end, scroll to start
              container.scrollTo({ 
                left: 0, 
                behavior: 'smooth' 
              });
            } else {
              // Normal scroll right
              container.scrollBy({ 
                left: 300, 
                behavior: 'smooth' 
              });
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dots (optional) */}
      <div className="md:hidden flex justify-center space-x-2 mt-4">
        {relatedProducts.map((_, index) => (
          <button 
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300"
            onClick={() => {
              const container = document.querySelector('.related-products-container');
              container.scrollTo({ left: index * 320, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      No related products found
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default ProductDetails;