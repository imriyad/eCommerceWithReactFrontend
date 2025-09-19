import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiShoppingCart, 
  FiPackage, 
  FiCreditCard, 
  FiStar, 
  FiUser, 
  FiMapPin, 
  FiHeart,
  FiEye,
  FiSettings,
  FiLogOut,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiGift,
  FiMessageCircle
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    cart: 0,
    reviews: 0,
    totalSpent: 0,
    loyaltyPoints: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL; // CRA

  useEffect(() => {
    document.title = "ShopEase - Customer Dashboard";
   
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/customer/dashboard/${user.id}`
        );
  
        // Set data from API response
        if (response.data.stats) setStats(response.data.stats);
        if (response.data.recentOrders) setRecentOrders(response.data.recentOrders);
        if (response.data.recentlyViewed) setRecentlyViewed(response.data.recentlyViewed);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setStats({
          orders: 0,
          wishlist: 0,
          cart: 0,
          reviews: 0,
          totalSpent: 0,
          loyaltyPoints: 0
        });
        setRecentOrders([]);
        setRecentlyViewed([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCustomerData();
  }, [user, navigate]);
  

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'Customer'}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                Here's what's happening with your account today
              </p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <FiGift className="w-5 h-5 mr-2 text-yellow-300" />
                  <span className="text-sm">{stats.loyaltyPoints} Loyalty Points</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 mr-2 text-yellow-300" />
                  <span className="text-sm">Member since {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-xl mr-4">
                <FiShoppingCart className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-xl mr-4">
                <FiHeart className="text-pink-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.wishlist}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl mr-4">
                <FiPackage className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cart Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cart}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <FiCreditCard className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Orders & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
                <Link to="/customer/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View all orders →
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FiPackage className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${order.total}</p>
                          <div className="flex items-center mt-1">
                            {order.status === 'Delivered' && <FiCheckCircle className="w-4 h-4 text-green-500 mr-1" />}
                            {order.status === 'Shipped' && <FiTruck className="w-4 h-4 text-blue-500 mr-1" />}
                            {order.status === 'Processing' && <FiClock className="w-4 h-4 text-yellow-500 mr-1" />}
                            <span className={`text-xs font-medium ${
                              order.status === 'Delivered' ? 'text-green-600' : 
                              order.status === 'Shipped' ? 'text-blue-600' : 
                              'text-yellow-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                  <p className="text-gray-400 text-sm">Start shopping to see your orders here</p>
                  <Link to="/" className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Recently Viewed Products */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Recently Viewed</h3>
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Browse more →
                </Link>
              </div>

              {recentlyViewed.length > 0 ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentlyViewed.map(product => (
                      <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FiEye className="text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-indigo-600 font-semibold">${product.price}</p>
                        </div>
                        <Link to={`/product/${product.id}`} className="text-indigo-600 hover:text-indigo-800">
                          <FiEye className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FiEye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No recently viewed products</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/cart" className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <FiShoppingCart className="text-indigo-600 mr-3" />
                  <span className="text-indigo-700 font-medium">View Cart</span>
                </Link>
                <Link to="/customer/wishlist" className="flex items-center p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                  <FiHeart className="text-pink-600 mr-3" />
                  <span className="text-pink-700 font-medium">My Wishlist</span>
                </Link>
                <Link to="/customer/orders" className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <FiPackage className="text-purple-600 mr-3" />
                  <span className="text-purple-700 font-medium">Order History</span>
                </Link>
                <Link to="/customer/profile" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <FiUser className="text-green-600 mr-3" />
                  <span className="text-green-700 font-medium">Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <FiUser className="text-gray-400 mr-3 w-4 h-4" />
                  <span className="text-gray-600">{user?.name || 'Customer Name'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiMessageCircle className="text-gray-400 mr-3 w-4 h-4" />
                  <span className="text-gray-600">{user?.email || 'customer@email.com'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiMapPin className="text-gray-400 mr-3 w-4 h-4" />
                  <span className="text-gray-600">2 addresses saved</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiCreditCard className="text-gray-400 mr-3 w-4 h-4" />
                  <span className="text-gray-600">1 payment method</span>
                </div>
              </div>
            </div>

            {/* Support & Help */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Link to="/support" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <FiMessageCircle className="text-blue-600 mr-3" />
                  <span className="text-blue-700 font-medium">Contact Support</span>
                </Link>
                <Link to="/faq" className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FiAlertCircle className="text-gray-600 mr-3" />
                  <span className="text-gray-700 font-medium">FAQ</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;