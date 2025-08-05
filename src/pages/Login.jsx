import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      const res = await axios.post('http://localhost:8000/api/login', form);
      const role = res.data.user.role;

      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'seller') navigate('/seller/dashboard');
      else if (role === 'customer') navigate('/customer/dashboard');
      else navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Login to ShopEase</h2>

        <div className="mb-4">
          <label className="block text-indigo-700 font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-indigo-700 font-semibold mb-1" htmlFor="password">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
