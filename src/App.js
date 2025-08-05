import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import SellerDashboard from "./pages/Dashboards/SellerDashboard";
import CustomerDashboard from "./pages/Dashboards/CustomerDashboard";
import AdminProductForm from "./pages/AdminProductForm";
import ProductDetails from './pages/ProductDetails';

import './index.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />

        <Route path="/admin/addProducts" element={<AdminProductForm />} />
        <Route path="/product/:id" element={<ProductDetails />} />


        {/* Redirect any unknown path to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
