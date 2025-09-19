"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AccountSettings = () => {
    const { user, setUser } = useAuth(); // ✅ Now using setUser from context
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        profile_picture: null,
    });
    const [passwords, setPasswords] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);

      const apiUrl = process.env.REACT_APP_API_URL; // CRA

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name,
                email: user.email,
                profile_picture: null,
            });
        }
    }, [user]);

    // Handle Profile Update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", profile.name);
            if (profile.profile_picture) {
                formData.append("profile_picture", profile.profile_picture);
            }

            const res = await axios.post(
                `${apiUrl}/api/customer/profile/${user.id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("Profile updated!");

            // ✅ Update AuthContext and persist to sessionStorage
            setUser(res.data.customer);
            sessionStorage.setItem("user", JSON.stringify(res.data.customer));

        } catch (err) {
            console.error("Profile update failed", err.response?.data || err.message);
            alert("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Password Change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            alert("New password and confirm password do not match.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${apiUrl}/api/customer/change-password/${user.id}`,
                {
                    current_password: passwords.current_password,
                    new_password: passwords.new_password,
                }
            );
            alert("Password changed successfully!");
            setPasswords({ current_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            console.error("Password change failed", err.response?.data || err.message);
            alert(err.response?.data?.message || "Error changing password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

            {/* Profile Update Form */}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="mt-1 w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Email (Read Only)</label>
                    <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="mt-1 w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>

            <hr className="my-6" />

            {/* Password Change Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
                <h2 className="text-xl font-semibold">Change Password</h2>

                <div>
                    <label className="block text-sm font-medium">Current Password</label>
                    <input
                        type="password"
                        value={passwords.current_password}
                        onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                        className="mt-1 w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">New Password</label>
                    <input
                        type="password"
                        value={passwords.new_password}
                        onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                        className="mt-1 w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                        type="password"
                        value={passwords.confirm_password}
                        onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                        className="mt-1 w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                >
                    {loading ? "Changing..." : "Change Password"}
                </button>
            </form>
        </div>
    );
};

export default AccountSettings;
