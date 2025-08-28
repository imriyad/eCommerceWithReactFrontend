import React, { useState, useContext, useEffect } from 'react';
import {
    FiSettings,
    FiLock,
    FiMail,
    FiLogOut,
    FiArrowRight,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import axios from 'axios';
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AccountSettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const { logout, user, token } = useContext(AuthContext); // JWT token from context
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get('token'); // If user is on password reset page

    // Set Axios default headers
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

    useEffect(() => {
        document.title = "ShopEase - Account Settings";
        if (user?.email) setEmail(user.email);
        if (user?.email_verified_at) setIsEmailVerified(true);
    }, [user]);

    // Forgot Password: sends reset link
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/forgot-password', { email });
            setMessage({ text: 'Password reset link sent to your email!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to send reset link.', type: 'error' });
        }
    };

    // Password Update: includes reset token if coming from email link
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (newPassword !== newPasswordConfirmation) {
            setMessage({ text: 'Passwords do not match!', type: 'error' });
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/reset-password', {
                token: resetToken,
                email,
                password: newPassword,
                password_confirmation: newPasswordConfirmation
            });
            setMessage({ text: 'Password updated successfully!', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Failed to update password.', type: 'error' });
        }
    };

    // Resend verification email
    const handleResendVerification = async () => {
        try {
            await axios.post('http://localhost:8000/api/email/verification-notification', {}, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    Accept: 'application/json'
                }
            });
            setMessage({ text: 'Verification link sent!', type: 'success' });
        } catch (error) {
            if (error.response?.status === 401) {
                setMessage({ text: 'You are not authorized. Please log in again.', type: 'error' });
                logout();
                navigate("/login");
            } else {
                setMessage({ text: error.response?.data?.message || 'Failed to send verification email.', type: 'error' });
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="flex items-center mb-6">
                        <FiSettings className="text-indigo-600 mr-2" size={24} />
                        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.type === 'success' ? <FiCheckCircle className="inline mr-2" /> : <FiXCircle className="inline mr-2" />}
                            {message.text}
                        </div>
                    )}

                    {/* Email Verification Status */}
                    <div className="mb-8 p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <FiMail className="text-gray-600 mr-2" />
                                <span className="font-medium">Email Verification</span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {isEmailVerified ? 'Verified' : 'Pending'}
                            </span>
                        </div>
                        {!isEmailVerified && (
                            <button
                                onClick={handleResendVerification}
                                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                            >
                                Resend verification email <FiArrowRight className="ml-1" />
                            </button>
                        )}
                    </div>

                    {/* Change Password Form */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FiLock className="mr-2 text-gray-600" /> Change Password
                        </h2>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="current-password">Current Password</label>
                                <input
                                    id="current-password"
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="new-password">New Password</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirm-password">Confirm New Password</label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newPasswordConfirmation}
                                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>

                    {/* Password Reset Form */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Forgot Password?</h2>
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Send Password Reset Link
                            </button>
                        </form>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t pt-6">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full text-red-600 hover:text-red-800 font-medium"
                        >
                            <FiLogOut className="mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
