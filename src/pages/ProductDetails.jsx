import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingCart, FiPlus, FiMinus, FiHeart, FiStar } from "react-icons/fi";
import { FaStar, FaRegStar, FaCheck, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { KeyIcon } from "@heroicons/react/16/solid";

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
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [wishlistChecked, setWishlistChecked] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL; // CRA

  useEffect(() => {
    document.title = "ShopEase - Product Details";
    const fetchData = async () => {
      try {
        // Fetch product
        const productRes = await axios.get(`${apiUrl}/api/products/${id}`);
        const productData = productRes.data;

        // Fetch active promotions
        const promosRes = await axios.get(`${apiUrl}/api/promotions/active`);
        const activePromos = promosRes.data;

        // Attach relevant promotions to this product
        const productPromotions = activePromos.filter(promo =>
          promo.applicable_products?.some(pid => Number(pid) === productData.id)
        );

        // Fetch average rating for this product
        let avgRating = 0;
        try {
          const reviewRes = await axios.get(`${apiUrl}/api/reviews/product/${productData.id}`);
          avgRating = reviewRes.data.avg_rating || 0;
        } catch (err) {
  
          console.error(`Error fetching rating for product ${productData.id}`, err);
          
        }

        setProduct({ 
          ...productData, 
          promotions: productPromotions,
          avgRating // Add the average rating to the product
        });

        // Check if product is in user's wishlist
        if (customerId) {
          try {
            const wishlistRes = await axios.get(`${apiUrl}/api/wishlist/${customerId}`);
            const wishlistItems = wishlistRes.data;
            const isInWishlist = wishlistItems.some(item => item.id === productData.id);
            setInWishlist(isInWishlist);
          } catch (wishlistErr) {
            console.error('Failed to fetch wishlist:', wishlistErr);
          } finally {
            setWishlistChecked(true);
          }
        } else {
          setWishlistChecked(true);
        }

        // Fetch related products from the same category
        if (productData.category_id) {
          setLoadingRelated(true);
          try {
            const relatedRes = await axios.get(`${apiUrl}/api/categories/${productData.category_id}/products`);
            let relatedProductsData = [];

            // Handle different response structures
            if (relatedRes.data && Array.isArray(relatedRes.data)) {
              relatedProductsData = relatedRes.data;
            } else if (relatedRes.data && relatedRes.data.products) {
              relatedProductsData = relatedRes.data.products;
            } else if (relatedRes.data && relatedRes.data.data) {
              relatedProductsData = relatedRes.data.data;
            }
            // Filter out the current product and limit to 6 related products
            const filteredRelated = relatedProductsData
              .filter(relatedProduct => relatedProduct.id !== productData.id)
              .slice(0, 6);

            // Fetch ratings for related products
            const relatedWithRatings = await Promise.all(
              filteredRelated.map(async (relatedProduct) => {
                try {
                  const reviewRes = await axios.get(
                    `${apiUrl}/api/reviews/product/${relatedProduct.id}`
                  );
                  const avgRating = reviewRes.data.avg_rating || 0;
                  return { ...relatedProduct, avgRating };
                } catch (err) {
                  console.error(`Error fetching rating for product ${relatedProduct.id}`, err);
                  return { ...relatedProduct, avgRating: 0 };
                }
              })
            );

            setRelatedProducts(relatedWithRatings);
          } catch (relatedErr) {
            console.error('Failed to fetch related products:', relatedErr);
            // Don't set error for related products failure
          } finally {
            setLoadingRelated(false);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, customerId]);

  const addToWishlist = async () => {
    if (!customerId) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    if (inWishlist) {
      alert("This product is already in your wishlist.");
      return;
    }

    setWishlistLoading(true);
    try {
      await axios.get(`${apiUrl}/sanctum/csrf-cookie`);

      // Add to wishlist
      await axios.post(`${apiUrl}/api/wishlist/${customerId}/${product.id}`);
      setInWishlist(true);
      alert("Product added to wishlist");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock || 10));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!customerId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.get(`${apiUrl}/sanctum/csrf-cookie`);
      const response = await axios.post(`${apiUrl}/api/cart`, {
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
    navigate(`${apiUrl}/checkout`, { state: { buyNowProduct: { product, quantity } } });
    window.scrollTo(0, 0);
  };

  const handleReview = () => {
    navigate(`${apiUrl}/product/${product.id}/review`, {
      state: {
        productId: product.id,
        productName: product.name // sending the product name
      }
    });
    window.scrollTo(0, 0);
  };

  const navigateToProduct = (productId) => {
    navigate(`${apiUrl}/product/${productId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-gray-900 py-6 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Main Product Section */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 shadow-inner hover:shadow-lg transition-all duration-300 group relative">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={product.image ? `http://localhost:8000/storage/${product.image}` : "https://via.placeholder.com/600x600?text=No+Image"}
                alt={product.name}
                className="w-full max-h-[350px] object-contain rounded-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1"
              />
              {/* Floating badge for stock status */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold shadow-lg ${product.stock > 0
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
                }`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>

              {/* Wishlist Button - Only show if not already in wishlist */}
              {!inWishlist && (
                <button
                  onClick={addToWishlist}
                  disabled={wishlistLoading}
                  className={`absolute top-2 left-2 p-2 rounded-full shadow-lg transition-all duration-300 bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-500 ${wishlistLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-label="Add to wishlist"
                >
                  <FiHeart className="w-5 h-5" />
                </button>
              )}

              {/* Show checkmark if already in wishlist */}
              {inWishlist && (
                <div className="absolute top-2 left-2 p-2 rounded-full shadow-lg bg-pink-500 text-white">
                  <FaCheck className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              {/* Product Header */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {product.brand && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                      {product.brand}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    New Arrival
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 bg-clip-text text-transparent">
                  {product.name}
                </h1>

                {/* Rating Display */}
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= Math.round(product.avgRating || 0) ? (
                        <FaStar key={star} className="w-4 h-4" />
                      ) : (
                        <FaRegStar key={star} className="w-4 h-4" />
                      )
                    )}
                  </div>
                  <span className="text-gray-500 font-medium text-xs">
                    ({product.avgRating ? product.avgRating.toFixed(1) : '0.0'})
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-extrabold text-indigo-900">
                    ${product.discount_price || product.price}
                  </span>
                  {product.discount_price && product.discount_price !== product.price && (
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-400 line-through">
                        ${product.price}
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        Save ${(parseFloat(product.price) - parseFloat(product.discount_price))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Show admin promotions */}
                {product.promotions && product.promotions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.promotions.map((promo, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg transform hover:scale-105 transition-transform"
                      >
                        {promo.type === "percentage"
                          ? `${promo.value}% OFF`
                          : promo.type === "discount"
                            ? `$${promo.value} OFF`
                            : promo.type === "bogo"
                              ? "Buy 1 Get 1 Free"
                              : promo.type === "free_shipping"
                                ? "Free Shipping"
                                : promo.type}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                    <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-2"></span>
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{product.description}</p>
                </div>
              )}

              {/* Product Features */}
              <div className="grid grid-cols-2 gap-2">
                {product.color && (
                  <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></div>
                      Color
                    </h3>
                    <div className="inline-flex items-center space-x-1 bg-indigo-50 rounded-full px-2 py-1">
                      <span className="text-indigo-800 font-semibold text-xs">{product.color}</span>
                      <FaCheck className="text-green-500 w-3 h-3" />
                    </div>
                  </div>
                )}

                {product.size && (
                  <div className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></div>
                      Size
                    </h3>
                    <div className="inline-flex items-center space-x-1 bg-purple-50 rounded-full px-2 py-1">
                      <span className="text-purple-800 font-semibold text-xs">{product.size}</span>
                      <FaCheck className="text-green-500 w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-2"></span>
                  Quantity
                </h3>
                <div className="inline-flex border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <FiMinus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 bg-white text-lg font-bold text-gray-800 border-x border-gray-200">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {product.stock > 0 ? `${product.stock} items available` : 'Currently out of stock'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="relative w-full group overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="text-lg tracking-wide">Buy Now</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </span>
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="absolute -inset-10 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 rotate-12"></div>
                </div>
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="relative w-full group overflow-hidden bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <span className="text-lg tracking-wide">Add to Cart</span>
                </span>
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="absolute -inset-10 bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110 rotate-12"></div>
                </div>
              </button>

              {/* Review Button */}
              <button
                onClick={() => handleReview()}
                className="relative w-full group overflow-hidden bg-gradient-to-r from-blue-50 via-white to-blue-50 text-blue-700 border-2 border-blue-200 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 transform group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg tracking-wide">Write a Review</span>
                </span>
                <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
              {/* Wishlist Button */}
              <button
                onClick={addToWishlist}
                disabled={product.stock === 0 || inWishlist || wishlistLoading || !wishlistChecked}
                className={`relative w-full group overflow-hidden font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${inWishlist
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-200'
                  : 'bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 border-2 border-pink-200'
                  }`}
              >
                {wishlistLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500 mr-2"></div>
                    <span className="text-lg tracking-wide">Checking...</span>
                  </span>
                ) : inWishlist ? (
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg tracking-wide">In Wishlist</span>
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-lg tracking-wide">Add to Wishlist</span>
                  </span>
                )}

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${inWishlist ? 'bg-green-400' : 'bg-pink-400'
                  }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {Object.keys(specs).length > 0 && (
          <div className="border-t border-gray-200 px-6 py-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Technical Specifications</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <h4 className="font-bold text-indigo-700 text-base mb-1">{key}</h4>
                  <p className="text-gray-700 text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="px-6 py-6 bg-white">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You May Also Like</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
            <p className="text-gray-600 text-sm mt-2">Discover more products from the same category</p>
          </div>

          {loadingRelated ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="relative">
              <div className="flex items-center">
                {/* Left Navigation Button */}
                <button
                  className="hidden md:block absolute left-0 z-10 p-1.5 -ml-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                  onClick={() => {
                    const container = document.querySelector('.related-products-container');
                    if (container.scrollLeft <= 10) {
                      container.scrollTo({
                        left: container.scrollWidth - container.clientWidth,
                        behavior: 'smooth'
                      });
                    } else {
                      container.scrollBy({
                        left: -300,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Products Container */}
                <div className="related-products-container flex space-x-4 overflow-x-auto pb-4 scrollbar-hide w-full">
                  {relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      onClick={() => navigateToProduct(relatedProduct.id)}
                      className="flex-shrink-0 w-56 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
                    >
                      <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-3 group">
                        <img
                          src={relatedProduct.image ? `http://localhost:8000/storage/${relatedProduct.image}` : "https://via.placeholder.com/300x300?text=No+Image"}
                          alt={relatedProduct.name}
                          className="h-full object-contain transform transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-base mb-1 text-gray-800 line-clamp-2">{relatedProduct.name}</h4>
                        {/* Rating Display for Related Products */}
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= Math.round(relatedProduct.avgRating || 0) ? (
                              <FaStar key={star} className="text-yellow-400 w-3 h-3" />
                            ) : (
                              <FaRegStar key={star} className="text-yellow-400 w-3 h-3" />
                            )
                          )}
                          <span className="text-xs text-gray-500 ml-1">
                            ({relatedProduct.avgRating ? relatedProduct.avgRating.toFixed(1) : '0.0'})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-indigo-700">${relatedProduct.discount_price || relatedProduct.price}</span>
                          {relatedProduct.discount_price && relatedProduct.discount_price !== relatedProduct.price && (
                            <span className="text-xs text-gray-400 line-through">${relatedProduct.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Navigation Button */}
                <button
                  className="hidden md:block absolute right-0 z-10 p-1.5 -mr-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                  onClick={() => {
                    const container = document.querySelector('.related-products-container');
                    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                      container.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                      });
                    } else {
                      container.scrollBy({
                        left: 300,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation Dots */}
              <div className="md:hidden flex justify-center space-x-1.5 mt-4">
                {relatedProducts.map((_, index) => (
                  <button
                    key={index}
                    className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-indigo-500 transition-colors"
                    onClick={() => {
                      const container = document.querySelector('.related-products-container');
                      container.scrollTo({ left: index * 240, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">No related products found</h3>
              <p className="text-gray-500 text-xs">Check out other categories for more amazing products!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductDetails;


