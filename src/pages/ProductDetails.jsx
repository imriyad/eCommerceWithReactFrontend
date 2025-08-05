import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Product not found:", err));
  }, [id]);

  if (!product) return <p className="text-center mt-20">Loading product details...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={`http://localhost:8000/storage/${product.image}`}
          alt={product.name}
          className="w-full h-80 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-bold text-indigo-700">{product.name}</h2>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <p className="mt-6 text-2xl font-semibold text-indigo-900">${product.price}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
