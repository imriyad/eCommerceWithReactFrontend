import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function EditProduct() {
  const [originalData, setOriginalData] = useState({ 
    name: "", 
    brand: "", 
    price: "", 
    stock: "" 
  });
  const [form, setForm] = useState({ 
    name: "", 
    brand: "", 
    price: "", 
    stock: "" 
  });
  const [changes, setChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL; // CRA

  useEffect(() => {
    document.title = "ShopEase - Edit Product";
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/products/${id}`);
        const productData = response.data;
        setOriginalData(productData);
        setForm(productData);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Track changes from original values
    if (originalData[name] !== value) {
      setChanges(prev => ({ ...prev, [name]: value }));
    } else {
      setChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[name];
        return newChanges;
      });
    }
  };

  const logAdminActivity = async (message) => {
    try {
      await axios.post(`${apiUrl}/api/admin/recent-activities`, {
        admin_id: user.id,
        message: message,
      });
    } catch (error) {
      console.error("Error logging admin activity:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only validate fields that are being updated
    if (Object.keys(changes).length === 0) {
      setError("No changes detected. Please update at least one field.");
      return;
    }
    
    if ((changes.price !== undefined && changes.price < 0) || 
        (changes.stock !== undefined && changes.stock < 0)) {
      setError("Price and stock cannot be negative");
      return;
    }
    
    try {
      setSaving(true);
      setError("");
      
      // Only send the changed fields to the API
      // await axios.patch(`/api/products/${id}`, changes);
            await axios.put(`/api/products/${id}`, form);

      
      setSuccess(true);
      await logAdminActivity(`Edited product: ${form.name} (ID: ${id})`);
      
      // Show success for 2 seconds before navigating
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (Object.keys(changes).length > 0) {
      if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
        navigate("/admin/products");
      }
    } else {
      navigate("/admin/products");
    }
  };

  const resetField = (fieldName) => {
    setForm(prev => ({ ...prev, [fieldName]: originalData[fieldName] }));
    setChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[fieldName];
      return newChanges;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}



              {/* <div className=" bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white"> */}

          <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Edit Product</h1>
                <p className="opacity-90">Update product information</p>
              </div>
              <button 
                onClick={() => navigate("/admin/products")}
                className="text-blue-100 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Changes Indicator */}
          {Object.keys(changes).length > 0 && (
            <div className="bg-yellow-50 border-b border-yellow-200 p-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-800 font-medium">
                  {Object.keys(changes).length} field{Object.keys(changes).length !== 1 ? 's' : ''} changed
                </span>
              </div>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                <p>Product updated successfully! Redirecting...</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  {changes.name !== undefined && (
                    <button 
                      type="button" 
                      onClick={() => resetField('name')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product Name"
                />
              </div>
              
              {/* Brand Field */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  {changes.brand !== undefined && (
                    <button 
                      type="button" 
                      onClick={() => resetField('brand')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brand"
                />
              </div>
              
              {/* Price Field */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  {changes.price !== undefined && (
                    <button 
                      type="button" 
                      onClick={() => resetField('price')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Price"
                />
              </div>
              
              {/* Stock Field */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  {changes.stock !== undefined && (
                    <button 
                      type="button" 
                      onClick={() => resetField('stock')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Stock"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving || Object.keys(changes).length === 0}
                className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 p-6 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow focus:outline-none"
                
                // className="bg-gradient-to-r flex-1 bg-indigo-900 via-purple-800 to-pink-700 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : `Update ${Object.keys(changes).length} Field${Object.keys(changes).length !== 1 ? 's' : ''}`}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className=" bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-9 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
              >
                Cancel
              </button>
            </div>
          </form>
          
          {/* Activity Log Note */}
          <div className="bg-blue-50 p-4 border-t border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Only changed fields will be updated. This action will be logged in the admin activity feed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;