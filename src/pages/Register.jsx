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
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Register</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name[0]}</p>}
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email[0]}</p>}
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password[0]}</p>}
        <br />

        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
