import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
     useEffect(() => {
      document.title = "ShopEase - Login";
    }, []);
  

  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   try {
  //     await axios.get('http://localhost:8000/sanctum/csrf-cookie');
  //     const res = await axios.post('http://localhost:8000/api/login', form);
  //     const user = res.data.user;
  //     sessionStorage.setItem("user", JSON.stringify(user));
  //       console.log("Logged in user:", user);
  //     const role = user.role;

  //     if (role === 'admin') window.location.href = '/admin/dashboard';
  //     else if (role === 'seller') window.location.href = '/seller/dashboard';
  //     else if (role === 'customer') window.location.href = '/customer/dashboard';
  //     else navigate('/');
  //   } catch (error) {
  //     alert('Login failed');
  //   }
  // };


const apiUrl = process.env.REACT_APP_API_URL; // make sure this is set in .env

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Get CSRF cookie
    await axios.get(`${apiUrl}/sanctum/csrf-cookie`);

    // Login request
    const res = await axios.post(`${apiUrl}/api/login`, form);

    const user = res.data.user;
    sessionStorage.setItem("user", JSON.stringify(user));
    console.log("Logged in user:", user);

    const role = user.role;
    if (role === 'admin') window.location.href = '/admin/dashboard';
    else if (role === 'seller') window.location.href = '/seller/dashboard';
    else if (role === 'customer') window.location.href = '/customer/dashboard';
    else navigate('/');
  } catch (error) {
    console.error("Login error:", error);
    alert('Login failed');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl  max-w-md w-full border border-indigo-300"
      >
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 ">
          Welcome Back to ShopEase
        </h2>

        <div className="mb-6">
          <label htmlFor="email" className="block text-indigo-700 font-semibold mb-2">
            Email Address
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
            placeholder="your.email@example.com"
            className="w-full px-5 py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-md"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="password" className="block text-indigo-700 font-semibold mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="w-full px-5 py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition shadow-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
        >
          Log In
        </button>

        <p className="mt-6 text-center text-indigo-700 font-medium">
          Don't have an account?{' '}
          <a href="/register" className="text-pink-600 hover:underline font-semibold">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;



