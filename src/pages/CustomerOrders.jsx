
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiPackage, FiCheckCircle, FiTruck, FiClock } from "react-icons/fi";

const apiUrl = process.env.REACT_APP_API_URL;

const statusIcons = {
  Delivered: <FiCheckCircle className="text-green-500 w-5 h-5 mr-1" />,
  Shipped: <FiTruck className="text-blue-500 w-5 h-5 mr-1" />,
  Processing: <FiClock className="text-yellow-500 w-5 h-5 mr-1" />,
};


const CustomerOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "ShopEase - My Orders";
   

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/customer/orders/${user.id}`
        );
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🛒 My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <FiPackage className="mx-auto w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">You have no orders yet.</p>
          <p className="text-gray-400 text-sm">Start shopping to place your first order!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow p-6 border border-gray-200"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FiPackage className="text-indigo-600 w-6 h-6" />
                  <span className="font-semibold text-gray-900">Order #{order.order_number}</span>
                </div>
                <div className="flex items-center text-sm font-medium">
                  {statusIcons[order.status]}
                  <span
                    className={`${
                      order.status === 'Delivered' ? 'text-green-600' :
                      order.status === 'Shipped' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Items</p>
                  <p className="text-gray-900">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Grand Total</p>
                  <p className="text-gray-900">${order.grand_total}</p>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`${apiUrl}/storage/${item.product.image}`}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-gray-800">{item.product.name}</span>
                    </div>
                    <span className="text-gray-600">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
