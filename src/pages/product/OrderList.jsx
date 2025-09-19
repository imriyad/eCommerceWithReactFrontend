import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // get logged-in admin

    const apiUrl = process.env.REACT_APP_API_URL; // CRA

  const logSellerActivity = async (message) => {
  try {
    await axios.post(`${apiUrl}/api/seller/recent-activities`, {
      seller_id: user.id, // make sure you have `user` object (from context or session)
      message: message,
    });
  } catch (error) {
    console.error("Error logging admin activity:", error);
  }
};

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/orders`, {
        params: { search, page },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('adminToken'),
        },
      
      });

      setOrders(res.data.data);
    } catch (err) {
      alert('Error loading orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    document.title = "ShopEase - Order Management";
    fetchOrders();
  }, [search, page]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${apiUrl}/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('adminToken'),
          },
        }
      );
      
      fetchOrders();
      alert('Order status updated');
      logSellerActivity(`Updated order ID ${orderId} to status ${newStatus}`);
    } catch {
      alert('Failed to update status');
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.delete(`${apiUrl}/api/orders/${orderId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('adminToken'),
        },
      });
      fetchOrders();
      alert('Order cancelled');
      logSellerActivity(`Cancelled order with ID ${orderId}`);
    } catch {
      alert('Failed to cancel order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Management</h1>

      <input
        type="text"
        placeholder="Search orders by ID, customer, status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 p-3 mb-6 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Customer', 'Status', 'Total', 'Actions'].map((title) => (
                  <th
                    key={title}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{order.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.grand_total}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-semibold px-3 py-1 rounded border border-red-600 hover:bg-red-600 hover:text-white transition"
                        title="Cancel Order"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded border ${
            page === 1
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-blue-500 text-blue-600 hover:bg-blue-100'
          }`}
        >
          Previous
        </button>
        <span className="font-semibold text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded border border-blue-500 text-blue-600 hover:bg-blue-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OrderList;
