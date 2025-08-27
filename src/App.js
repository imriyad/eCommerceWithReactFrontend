import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";
import CustomerLayout from "./components/CustomerLayout";
import Chatbot from "./components/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CustomerOrders from "./pages/CustomerOrders";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import SellerDashboard from "./pages/Dashboards/SellerDashboard";
import CustomerDashboard from "./pages/Dashboards/CustomerDashboard";
import AdminProductForm from "./pages/AdminProductForm";
import ProductDetails from "./pages/ProductDetails";
import EditProduct from "./pages/admin/EditProduct";
import AdminProductList from "./pages/admin/AdminProductList";
import SellerProductList from "./pages/seller/SellerProductList";
import SellerEditProduct from "./pages/seller/SellerEditProduct";
import SellerProductForm from "./pages/seller/SellerProductForm";
import CartPage from "./pages/product/CartPage";
import "./index.css";
import AdminUsers from "./pages/AdminUsers";
import CheckoutPage from "./pages/product/CheckoutPage";
import OrderConfirmation from "./pages/product/OrderConfirmation";
import OrderList from "./pages/product/OrderList";
import AccountSettings from "./pages/AccountSettings";
import PromotionsPage from "./pages/product/PromotionsPage";
import SpecialOffers from "./pages/product/SpecialOffers";
import SellerLayout from "./components/SellerLayout";
import SellerOrderList from "./pages/seller/SellerOrderList";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import CustomerProfile from "./pages/CustomerProfile";
import HelpSupport from "./pages/HelpSupport";
import Settings from "./pages/Settings";
import CustomerWishlist from "./pages/product/CustomerWishlist";
import Reviews from "./pages/product/Reviews";


function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar visible on all pages */}
        <Navbar />

        {/* Padding top so content is not hidden behind fixed navbar */}
        <div className="pt-16 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />


            {/* Admin Layout wrapper */}
            <Route path="/admin" element={<AdminLayout />}>

              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="addProducts" element={<AdminProductForm />} />
              <Route path="editProduct/:id" element={<EditProduct />} />
              <Route path="products" element={<AdminProductList />} />
              <Route path="promotions" element={<PromotionsPage />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<OrderList />} />
            </Route>


            <Route path="/customer" element={<CustomerLayout />}>
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="profile" element={<CustomerProfile />} />
              <Route path="support" element={<HelpSupport />} />
              <Route path="settings" element={<Settings />} />
              <Route path="wishlist" element={<CustomerWishlist />} />

            </Route>

            {/* Seller Layout wrapper */}
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<SellerDashboard />} />
              <Route path="dashboard" element={<SellerDashboard />} />
              <Route path="products" element={<SellerProductList />} />
              <Route path="editProduct/:id" element={<SellerEditProduct />} />
              <Route path="addProducts" element={<SellerProductForm />} />
              <Route path="orders" element={<OrderList />} />
            </Route>


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


            {/* <Route path="/customer/dashboard" element={<CustomerDashboard />} /> */}

            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id/products" element={<CategoryProducts />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={< OrderConfirmation />} />

            <Route path="/account" element={<AccountSettings />} />
            <Route path="/special-offers" element={<SpecialOffers />} />
            
            <Route path="/product/:id/review" element={<Reviews />} />

            

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;
