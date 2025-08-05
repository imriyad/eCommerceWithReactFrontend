import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminProductForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    tax: '',
    brand: '',
    stock: '',
    sku: '',
    weight: '',
    dimensions: '',
    tags: '',
    warranty: '',
    specifications: '',
    color: '',
    size: '',
    status: 'Draft',
    is_active: true,
    category_id: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? e.target.checked : value;
    setForm({ ...form, [name]: val });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      formData.append('is_active', form.is_active ? 1 : 0);
      formData.append('image', image);

      await axios.post('http://localhost:8000/api/products', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Product created successfully!');
      setForm({
        name: '', description: '', price: '', discount_price: '', tax: '',
        brand: '', stock: '', sku: '', weight: '', dimensions: '', tags: '',
        warranty: '', specifications: '', color: '', size: '', status: 'Draft',
        is_active: true, category_id: '',
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to create product. Please check all fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Create New Product
            </span>
          </h2>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
            Admin Panel
          </span>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium flex items-center">
              {message.includes('✅') ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          {/* Basic Info */}
          <Section title="Basic Information" icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Brand" name="brand" value={form.brand} onChange={handleChange} />
            <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
            <Input label="Stock" type="number" name="stock" value={form.stock} onChange={handleChange} />
          </Section>

          {/* Pricing */}
          <Section title="Pricing & Inventory" icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            <Input label="Price ($)" type="number" name="price" value={form.price} onChange={handleChange} required />
            <Input label="Discount Price ($)" type="number" name="discount_price" value={form.discount_price} onChange={handleChange} />
            <Input label="Tax (%)" type="number" name="tax" value={form.tax} onChange={handleChange} />
          </Section>

          {/* Physical Attributes */}
          <Section title="Physical Attributes" icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4">
            <Input label="Weight (e.g. 1.5kg)" name="weight" value={form.weight} onChange={handleChange} />
            <Input label="Dimensions (e.g. 10x5x2 cm)" name="dimensions" value={form.dimensions} onChange={handleChange} />
            <Input label="Color" name="color" value={form.color} onChange={handleChange} />
            <Input label="Size" name="size" value={form.size} onChange={handleChange} />
          </Section>

          {/* Categorization */}
          <Section title="Categorization" icon="M4 6h16M4 12h16M4 18h16">
            <Select 
              label="Category" 
              name="category_id" 
              value={form.category_id} 
              onChange={handleChange} 
              required
              options={[{ value: '', label: '-- Select Category --' }, ...categories.map(cat => ({ value: cat.id, label: cat.name }))]}
            />
            <Input label="Tags (comma separated)" name="tags" value={form.tags} onChange={handleChange} />
            <Select 
              label="Status" 
              name="status" 
              value={form.status} 
              onChange={handleChange}
              options={[
                { value: 'Published', label: 'Published' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Archived', label: 'Archived' }
              ]}
            />
            <Toggle 
              label="Is Active?" 
              name="is_active" 
              checked={form.is_active} 
              onChange={(e) => handleChange({ target: { name: 'is_active', value: e.target.checked } })}
            />
          </Section>

          {/* Product Details */}
          <Section title="Product Details" icon="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" fullWidth>
            <Textarea label="Description" name="description" value={form.description} onChange={handleChange} required />
            <Textarea label="Warranty" name="warranty" value={form.warranty} onChange={handleChange} />
            <Textarea label="Specifications" name="specifications" value={form.specifications} onChange={handleChange} />
          </Section>

          {/* Image Upload */}
          <Section title="Product Image" icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" fullWidth>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} required className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              {imagePreview && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                  <div className="mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50 flex justify-center">
                    <img src={imagePreview} alt="Preview" className="h-48 object-contain rounded" />
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper Section Component for grouping form parts
const Section = ({ title, icon, children, fullWidth = false }) => (
  <div className={fullWidth ? "md:col-span-2 space-y-6" : "space-y-6"}>
    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
      <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      {title}
    </h3>
    {children}
  </div>
);

// Reusable Input Component
const Input = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
    />
  </div>
);

// Reusable Textarea Component
const Textarea = ({ label, name, value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      rows={4}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
    />
  </div>
);

// Reusable Select Component
const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Reusable Toggle Component
const Toggle = ({ label, name, checked, onChange }) => (
  <div className="flex items-center space-x-3">
    <button
      type="button"
      className={`${checked ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange({ target: { checked: !checked } })}
    >
      <span
        aria-hidden="true"
        className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
  </div>
);

export default AdminProductForm;
