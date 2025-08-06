import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
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



import "./index.css";

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

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />

            <Route path="/admin/addProducts" element={<AdminProductForm />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin/editProduct/:id" element={<EditProduct />} />
            <Route path="/admin/products" element={<AdminProductList />} />

             <Route path="/seller/products" element={<SellerProductList />} />
             <Route path="/seller/editProduct/:id" element={<SellerEditProduct />} />
            <Route path="/seller/addProducts" element={<SellerProductForm />} />



            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
