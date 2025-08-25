import React from "react";
import { FiHelpCircle, FiMail, FiPhone, FiFileText } from "react-icons/fi";

const HelpSupport = () => {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">💬 Help & Support</h1>
      <p className="text-center text-gray-600 mb-10">
        We're here to assist you with your orders, payments, and account issues.  
        Find answers below or contact us directly.
      </p>

      {/* FAQs */}
      <section className="mb-10">
        
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FiHelpCircle className="text-blue-500" /> Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-white shadow rounded-lg hover:shadow-md transition">
            <h3 className="font-semibold">📦 How do I track my order?</h3>
            <p className="text-gray-600 mt-2">
              You can track your order from the <span className="font-medium">"My Orders"</span> section in your profile.
            </p>
          </div>
          <div className="p-5 bg-white shadow rounded-lg hover:shadow-md transition">
            <h3 className="font-semibold">↩️ How do I return a product?</h3>
            <p className="text-gray-600 mt-2">
              Visit the <span className="font-medium">"My Orders"</span> page, select the product, and request a return.
            </p>
          </div>
          <div className="p-5 bg-white shadow rounded-lg hover:shadow-md transition">
            <h3 className="font-semibold">💳 What payment methods do you accept?</h3>
            <p className="text-gray-600 mt-2">
              We accept Credit/Debit Cards, Mobile Payments, and COD (Cash on Delivery).
            </p>
          </div>
          <div className="p-5 bg-white shadow rounded-lg hover:shadow-md transition">
            <h3 className="font-semibold">🚚 How long does delivery take?</h3>
            <p className="text-gray-600 mt-2">
              Standard delivery takes <span className="font-medium">3–7 business days</span> depending on your location.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FiMail className="text-green-500" /> Contact Support
        </h2>
        <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 shadow rounded-lg text-gray-800">
          <p className="mb-3">Still need help? Reach out to us anytime:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FiMail className="text-blue-500" /> <span>Email: support@shopease.com</span>
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-green-500" /> <span>Phone: +880-1234-567890</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Policies */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FiFileText className="text-purple-500" /> Policies
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <a
            href="/return-policy"
            className="p-5 bg-white shadow rounded-lg hover:shadow-md transition text-center"
          >
            <h3 className="font-semibold mb-2">↩️ Return & Refund Policy</h3>
            <p className="text-gray-600 text-sm">Learn about returns & refunds.</p>
          </a>
          <a
            href="/shipping-policy"
            className="p-5 bg-white shadow rounded-lg hover:shadow-md transition text-center"
          >
            <h3 className="font-semibold mb-2">🚚 Shipping Policy</h3>
            <p className="text-gray-600 text-sm">Understand our shipping process.</p>
          </a>
          <a
            href="/privacy-policy"
            className="p-5 bg-white shadow rounded-lg hover:shadow-md transition text-center"
          >
            <h3 className="font-semibold mb-2">🔒 Privacy Policy</h3>
            <p className="text-gray-600 text-sm">How we protect your data.</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default HelpSupport;
