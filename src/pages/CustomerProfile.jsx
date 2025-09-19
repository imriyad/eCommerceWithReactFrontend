import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL; // CRA
  useEffect(() => {
    document.title = "ShopEase - Customer Profile";
    console.log("Logged-in user:", user);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/api/customer/profile/${user.id}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
        
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
  try {
    const formData = new FormData();
    for (const key in profile) {
      if (profile[key] !== null && profile[key] !== undefined) {
        formData.append(key, profile[key]);
      }
    }

    await axios.put(
      `${apiUrl}/api/customer/profile/${user.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Profile updated successfully!");
    setIsEditing(false);
  } catch (err) {
    console.error(
      "Failed to update profile:",
      err.response?.data || err.message
    );
  }
};

  

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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="relative w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
          {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Profile Picture</h2>
          <p className="text-sm text-gray-500">Update your profile photo</p>
          <label className="mt-2 inline-block cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition">
            Upload Image
            <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif" />
          </label>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
        </div>
      </div>


      {/* Personal Information */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:underline text-sm"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
            >
              Save
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              type="text"
              name="first_name"
              value={profile.first_name || profile.name?.split(" ")[0] || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-gray-800 ${
                isEditing ? "bg-white" : "bg-gray-50"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={profile.last_name || profile.name?.split(" ")[1] || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-gray-800 ${
                isEditing ? "bg-white" : "bg-gray-50"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="mt-1 w-full border rounded-lg px-3 py-2 text-gray-800 bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-1 w-full border rounded-lg px-3 py-2 text-gray-800 ${
                isEditing ? "bg-white" : "bg-gray-50"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;
