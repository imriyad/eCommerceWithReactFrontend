
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CustomerWishlist = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const customer_id = user?.id;

    const [wishlist, setWishlist] = useState([]);
    const [message, setMessage] = useState("");

    const customerId = user?.id;
    const [wishlistItems, setWishlistItems] = useState([]);

      const apiUrl = process.env.REACT_APP_API_URL; // CRA

    // Fetch wishlist items
    useEffect(() => {
        document.title = "ShopEase - My Wishlist";

        axios
            .get(`${apiUrl}/api/wishlist/${customer_id}`)
            .then((res) => setWishlist(res.data))
            .catch((err) => console.error("Failed to fetch wishlist items:", err));
    }, [customer_id, navigate]);

    // Remove from wishlist
    // const handleRemove = async (productId) => {
    //     try {
    //         await axios.delete(`http://localhost:8000/api/wishlist/${customerId}/${productId}`);
    //         setWishlistItems(prev => prev.filter(item => item.id !== productId));
    //          showMessage("✅ Removed from wishlist."); // Uncomment if you have a notification system
    //          window.location.reload();
    //     } catch (error) {
    //         console.error("Error removing wishlist item:", error);
    //         alert("Failed to remove from wishlist");
    //     }
    // };

    const handleRemove = async (productId) => {
    try {
        await axios.delete(`${apiUrl}/api/wishlist/${customerId}/${productId}`);
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      showMessage("✅ Product removed from wishlist.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
    }
  };

    // Add to cart
    const handleAddToCart = async (product) => {
        try {
            await axios.post(`${apiUrl}/api/cart`, {
                customer_id,
                product_id: product.id,
                quantity: 1,
                color: product.color || "",
                size: product.size || "",
            });
            showMessage("✅ Added to cart.");
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Show temporary message
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">💖 Your Wishlist</h2>

            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
                    {message}
                </div>
            )}

            {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div className="space-y-4">
                    {wishlist.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-6 p-4 bg-white shadow rounded-lg"
                        >
                            <img
                                src={`${apiUrl}/storage/${item.product.image}`}
                                alt={item.product.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                <p className="text-sm text-gray-600">
                                    Price: ${item.product.price}
                                </p>
                                <p className="text-sm text-gray-600">Color: {item.product.color}</p>
                                <p className="text-sm text-gray-600">Size: {item.product.size}</p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className="font-semibold">
                                    ${item.product.price}
                                </span>
                                <button
                                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                    onClick={() => handleAddToCart(item.product)}
                                >
                                    <FiShoppingCart size={18} /> Add to Cart
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRemove(item.product.id)}
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

export default CustomerWishlist;
