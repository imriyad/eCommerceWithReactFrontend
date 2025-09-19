import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiShoppingCart } from "react-icons/fi";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL; // CRA
  useEffect(() => {
    document.title = "ShopEase - Order Confirmation";
    async function fetchOrder() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${apiUrl}/api/orders/${orderId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError("Failed to fetch order details.");
        }
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  // Download as PDF
  const downloadPDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
      pdf.save(`Invoice-${order.order_number}.pdf`);
    });
  };

  if (loading) return <div className="p-6">Loading order details...</div>;
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Go to Home
        </button>
      </div>
    );

  // 🟢 Calculate totals
  const subtotal =
    order.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = order.shipping ? parseFloat(order.shipping) : 0;
  const grandTotal = subtotal + tax + shipping;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {/* Invoice Section */}
      <div ref={invoiceRef} className="p-8 bg-white rounded shadow-lg" id="invoice">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center">
            <FiShoppingCart className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-500 ml-2">ShopEase</span>
          </div>
          <div className="text-right">
            <p>
              <strong>Invoice No:</strong> INV-{order.id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Order No:</strong> {order.order_number}
            </p>
          </div>
        </div>

        {/* Seller & Buyer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">From:</h2>
            <p className="font-bold text-lg text-gray-800 mb-1">ShopEase</p>
            <p className="text-gray-600">122/3 Baridhara</p>
            <p className="text-gray-600">Dhaka, Bangladesh</p>
            <p className="text-gray-600">Email: support@shopease.com</p>
            <p className="text-gray-600">Phone: +88 01234-56789</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Bill To:</h2>
            <p className="font-medium text-gray-800">{order.name}</p>
            <p className="text-gray-600">{order.address}</p>
            <p className="text-gray-600">
              {order.city}, {order.postal_code}
            </p>
            <p className="text-gray-600">{order.email}</p>
          </div>
        </div>

        {/* Items Table */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-3 text-left font-medium">Product</th>
                <th className="border px-4 py-3 text-center font-medium">Qty</th>
                <th className="border px-4 py-3 text-right font-medium">Price</th>
                <th className="border px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="border px-4 py-3">{item.product.name}</td>
                  <td className="border px-4 py-3 text-center">
                    {item.quantity}
                  </td>
                  <td className="border px-4 py-3 text-right">${item.price}</td>
                  <td className="border px-4 py-3 text-right">
                    ${(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">${subtotal}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-700">Tax (10%):</span>
              <span className="font-medium">${tax}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-medium">${shipping}</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-lg border-t-2 border-indigo-500 mt-2">
              <span>Grand Total:</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 mb-2">Payment Method: {order.payment_method ?? "Cash on Delivery"}</p>
          <p className="text-gray-600 mb-4">Status: <span className="font-medium capitalize">{order.status}</span></p>
          <p className="text-lg text-indigo-700 font-medium">Thank you for your purchase, {order.name}!</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Download Invoice (PDF)
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}