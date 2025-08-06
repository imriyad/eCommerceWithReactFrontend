import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { FaStar, FaRegStar, FaCheck } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";


function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [specs, setSpecs] = useState({});
const { user } = useAuth();
const customerId = user?.id; 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.color) setSelectedColor(res.data.color);
        if (res.data.size) setSelectedSize(res.data.size);

        if (res.data.specifications) {
          try {
            const parsedSpecs =
              typeof res.data.specifications === "string"
                ? JSON.parse(res.data.specifications)
                : res.data.specifications;
            setSpecs(parsedSpecs);
          } catch (parseErr) {
            console.error("Failed to parse specifications:", parseErr);
            setSpecs({});
          }
        }
      } catch (err) {
        console.error("Product not found:", err);
        setError("Product not found or failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stock || 10));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      productId: product.id,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    alert(`${quantity} ${product.name} added to cart!`);
  };
const [inWishlist, setInWishlist] = useState(false);

// You can check if the product is already in wishlist on load, if you have that info
// For now, it's false initially

const handleWishlistToggle = async () => {
  if (!customerId) {
    alert("You must be logged in to manage your wishlist.");
    return;
  }

  try {
    // Ensure CSRF token is set for Sanctum
    await axios.get("http://localhost:8000/sanctum/csrf-cookie");

    if (!inWishlist) {
      // Add to wishlist
      await axios.post("http://localhost:8000/api/wishlist", {
        product_id: product.id,
        // customer_id: customerId,
      });
      alert(`Added "${product.name}" to your wishlist!`);
    } else {
      // Remove from wishlist
      await axios.delete(`http://localhost:8000/api/wishlist/${product.id}`);
      alert(`Removed "${product.name}" from your wishlist.`);
    }

    setInWishlist(!inWishlist);
  } catch (error) {
    console.error("Wishlist action failed", error);
    alert("Something went wrong. Please make sure you're logged in.");
  }
};

  const handleBuyNow = () => {
    console.log("Buy now:", {
      productId: product.id,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    alert(`Proceeding to checkout with ${quantity} ${product.name}`);
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
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg max-w-md mx-auto shadow-lg">
          <p className="text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-10 p-10">
          {/* Product Image */}
          <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6 shadow-inner hover:shadow-lg transition-shadow duration-300">
            <img
              src={
                product.image
                  ? `http://localhost:8000/storage/${product.image}`
                  : "https://via.placeholder.com/600x600?text=No+Image"
              }
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
                  {[...Array(5)].map((_, i) =>
                    i < 4 ? (
                      <FaStar key={i} className="w-6 h-6" />
                    ) : (
                      <FaRegStar key={i} className="w-6 h-6" />
                    )
                  )}
                </div>
                <span className="ml-3 text-gray-500 font-medium">(1247 reviews)</span>
              </div>

              {product.brand && (
                <p className="mt-3 text-gray-600 text-lg">
                  Brand:{" "}
                  <span className="text-indigo-700 font-semibold">{product.brand}</span>
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-extrabold text-indigo-900">
                  ${product.price}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.discount_price}
                    </span>
                    <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded-full shadow">
                      {Math.round(
                        (1 - product.price / product.discount_price) * 100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              {product.stock !== null && (
                <p
                  className={`mt-2 text-lg font-semibold ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} items in stock`
                    : "Out of stock"}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">Description</h3>
                <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color Selection */}
            {product.color && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Color</h3>
                <div className="inline-flex items-center space-x-3 bg-indigo-50 rounded-full px-5 py-3 cursor-pointer select-none shadow-inner hover:shadow-lg transition-shadow duration-300">
                  <span className="text-indigo-800 font-semibold">{product.color}</span>
                  <FaCheck className="text-green-500 w-6 h-6" />
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.size && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Size</h3>
                <div className="inline-flex items-center space-x-3 bg-indigo-50 rounded-full px-5 py-3 cursor-pointer select-none shadow-inner hover:shadow-lg transition-shadow duration-300">
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
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-6 h-6 text-gray-600" />
                </button>
                <span className="px-8 py-3 bg-white text-xl font-semibold flex items-center justify-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock !== null && quantity >= product.stock}
                  aria-label="Increase quantity"
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
                className="flex-1 bg-indigo-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>

              <button
    onClick={handleWishlistToggle}
    className={`flex-1 flex items-center justify-center gap-3 font-semibold py-4 rounded-xl shadow-lg focus:outline-none focus:ring-4 transition
      ${
        inWishlist
          ? "bg-yellow-400 text-indigo-900 hover:bg-yellow-500 focus:ring-yellow-300"
          : "bg-gray-300 text-gray-900 hover:bg-gray-400 focus:ring-gray-300"
      }`}
  >
    {inWishlist ? (
      <FaStar className="w-6 h-6 text-yellow-500" />
    ) : (
      <FaRegStar className="w-6 h-6" />
    )}
    {inWishlist ? "In Wishlist" : "Add to Wishlist"}
  </button>

            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {Object.keys(specs).length > 0 && (
          <div className="border-t border-gray-200 px-10 py-8 bg-gray-50 rounded-b-3xl mt-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(specs).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h4 className="font-semibold text-indigo-700 text-lg">{key}</h4>
                  <p className="mt-2 text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
