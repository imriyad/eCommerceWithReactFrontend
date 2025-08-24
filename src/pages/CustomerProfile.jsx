import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/customer/profile/${user.id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [user]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-red-500">Profile not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="w-32 font-semibold text-gray-700">Full Name:</span>
          <span className="text-gray-900">{profile.name}</span>
        </div>

        <div className="flex items-center">
          <span className="w-32 font-semibold text-gray-700">Email:</span>
          <span className="text-gray-900">{profile.email}</span>
        </div>

        <div className="flex items-center">
          <span className="w-32 font-semibold text-gray-700">Phone:</span>
          <span className="text-gray-900">{profile.phone || "N/A"}</span>
        </div>

        <div className="flex items-center">
          <span className="w-32 font-semibold text-gray-700">Address:</span>
          <span className="text-gray-900">{profile.address || "N/A"}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;
