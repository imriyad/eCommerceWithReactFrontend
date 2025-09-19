import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const customer_id = user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  // Fetch cart items
  useEffect(() => {
    document.title = "ShopEase - My Cart";

    axios
      .get(`http://localhost:8000/api/cart/${customer_id}`)
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error("Failed to fetch cart items:", err));
  }, [customer_id, navigate]);

  // Delete cart item
  const handleDelete = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${cartId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      showMessage("✅ Product removed from cart.");
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  // Show temporary message
  const showMessage = (msg) => {
    // setMessage(msg);
    alert(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // Update quantity
  const handleQuantityChange = async (cartId, newQty) => {
    if (newQty < 1) return; // Prevent zero or negative quantities

    try {
      await axios.put(`http://localhost:8000/api/cart/${cartId}`, {
        quantity: newQty,
      });

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showMessage("Your cart is empty. Add items before checkout.");
      return;
    }
    navigate("/checkout");
  };

  return (
            // <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">

     <div className="p-8 max-w-6xl mx-auto"> 
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiShoppingBag className="inline" /> Your Shopping Cart
      </h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        // <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">

          <p className="text-gray-100 text-lg mb-4">Your cart is empty.</p>
          <button 
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 p-4 bg-white shadow rounded-lg"
              >
                <img
                  src={`http://localhost:8000/storage/${item.product.image}`}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Price: ${item.product.price}
                  </p>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-gray-600">Color: {item.product.color}</p>
                  <p className="text-sm text-gray-600">Size: {item.product.size}</p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="text-red-500 hover:text-red-700 mt-2"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="flex justify-between mb-2">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Tax:</span>
                <span>${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span>${(subtotal * 1.08).toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={() => navigate("/products")}
                className="w-full py-2 mt-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;