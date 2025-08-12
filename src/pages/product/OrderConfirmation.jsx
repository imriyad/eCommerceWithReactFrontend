import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError("Failed to fetch order details.");
        }
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-6">Loading order details...</div>;
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Go to Home
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        Order Confirmation
      </h1>
      <p className="mb-4">
        Thank you for your order, <strong>{order.name}</strong>!
      </p>
      <p className="mb-4">
        <strong>Order Number:</strong> {order.order_number}
      </p>
      <p className="mb-4">
        <strong>Status:</strong> {order.status}
      </p>
      <p className="mb-4">
        <strong>Total:</strong> ${order.grand_total}
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Shipping Information</h2>
      <p>{order.address}</p>
      <p>
        {order.city}, {order.postal_code}
      </p>
      <p>{order.email}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Items</h2>
      <ul className="divide-y divide-gray-200">
        {order.items.map((item) => (
          <li key={item.id} className="py-4 flex items-center gap-4">
            <img
              src={`http://localhost:8000/storage/${item.product.image}`}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity} × ${item.price}
              </p>
            </div>
            <div className="font-semibold">${(item.quantity * item.price)}</div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
      >
        Back to Home
      </button>
    </div>
  );
}
