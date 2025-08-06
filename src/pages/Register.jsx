import React, { useState } from "react";
import axios from "axios";

// Axios configuration
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    try {
      await axios.get("/sanctum/csrf-cookie"); // Required by Sanctum
      await axios.post("/api/register", form);
      setMessage("✅ Registration successful!");
      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors); // Laravel validation errors
      } else {
        setMessage("❌ Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-indigo-300">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-md">
          Create your <span className="text-pink-600">ShopEase</span> Account
        </h2>

        {message && (
          <p
            className={`mb-6 text-center font-semibold ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full px-5 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
            )}
          </div>

          {/* Password Confirmation */}
          <div>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition duration-300"
          >
            Register
          </button>

          {/* Login Redirect */}
          <p className="mt-6 text-center text-indigo-700 font-medium">
            You already have an account?{' '}
            <a
              href="/login"
              className="text-pink-600 hover:underline font-semibold"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
