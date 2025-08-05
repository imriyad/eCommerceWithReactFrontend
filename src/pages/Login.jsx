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
      // Redirect based on role
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'seller') navigate('/seller/dashboard');
      else if (role === 'customer') navigate('/customer/dashboard');
      else navigate('/'); // fallback or guest
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
