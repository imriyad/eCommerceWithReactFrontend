import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditProduct() {
  const [form, setForm] = useState({ name: "", brand: "", price: "", stock: "" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${id}`, form);
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} className="border p-2 w-full" />
        <input name="brand" value={form.brand} onChange={handleChange} className="border p-2 w-full" />
        <input name="price" value={form.price} type="number" onChange={handleChange} className="border p-2 w-full" />
        <input name="stock" value={form.stock} type="number" onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}

export default EditProduct;
