import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const customer_id = user?.id;

  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState(""); // ✅ message state

  useEffect(() => {
    if (!customer_id) return;

    axios
      .get(`http://localhost:8000/api/cart/${customer_id}`)
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch cart items:", err);
      });
  }, [customer_id]);

  const handleDelete = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${cartId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));

      // ✅ Show success message
      setMessage("✅ Product removed from cart.");
      setTimeout(() => setMessage(""), 3000); // clear after 3 seconds
    } catch (error) {
      console.error("Error deleting cart item:", error);
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
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-600">Color: {item.color}</p>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(item.id)}
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
