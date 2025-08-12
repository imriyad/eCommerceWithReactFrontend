import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const customer_id = user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch cart items
  useEffect(() => {
    if (!customer_id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

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
    setMessage(msg);
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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
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

                <p className="text-sm text-gray-600">Color: {item.color}</p>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
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
      )}
    </div>
  );
};

export default Cart;
