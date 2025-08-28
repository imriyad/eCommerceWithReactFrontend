import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const customer_id = user?.id;

  const stripePromise = loadStripe("pk_test_51RVyt0Q8SsBu9JNWYySosf553VZKOn8MbIhJzqRSTeBMTYCKlWEk3MjohDVnaqk7WT8PjDdhwopn6jRc7Yg7ALfB00or2FVctC"); // replace with your Stripe public key
  const CardPayment = ({ formData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleCardPayment = async () => {
      setProcessing(true);
      setError(null);

      try {
        // 1. Create payment intent on backend
        const { data } = await axios.post("http://localhost:8000/api/create-payment-intent", {
          amount: Math.round(parseFloat(formData.totalAmount) * 100), // amount in cents
        });

        const clientSecret = data.clientSecret;

        if (!clientSecret) {
          setError("No client secret returned from backend.");
          return false;
        }

        // 2. Confirm card payment using client_secret
        const cardElement = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: cardElement, billing_details: { name: formData.fullName, email: formData.email } }
        });

        if (result.error) {
          setError(result.error.message); // Payment failed
          return false;
        }
        if (result.paymentIntent.status === "succeeded") {
          return true; // Payment successful
        } else if (result.paymentIntent.status === "requires_payment_method") {
          setError("Payment failed. Please use another card.");
          return false;
        } else {
        }

        return false;
      } catch (err) {
        console.error("Payment error:", err.message);
        setError(err.message);
        return false;
      } finally {
        setProcessing(false);
      }
    };


    return (
      <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
        <CardElement className="p-2 border border-gray-300 rounded-lg" />
        {error && <p className="text-red-600">{error}</p>}
      </div>
    );
  };


  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postal_code: "", // match backend field name
    payment: "cash_on_delivery", // default payment method
    // For card payments (not used directly here)
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });

  const [activeStep, setActiveStep] = useState(1);
  
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct; 

  // Fetch cart items
  useEffect(() => {
    document.title = "ShopEase - Checkout";
    if (!customer_id) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    // Check for Buy Now product
    if (location.state && location.state.buyNowProduct) {
      const { product, quantity } = location.state.buyNowProduct;
      setCartItems([{ id: 0, product, quantity }]);
      setLoading(false);
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:8000/api/cart/${customer_id}`)
        .then((res) => {
          setCartItems(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch cart items:", err);
          setLoading(false);
        });
    }
  }, [customer_id, navigate, location]);


  // Calculate total
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic frontend validation before sending
    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.postal_code) {
      alert("Please fill in all required shipping information.");
      setLoading(false);
      setActiveStep(1);
      return;
    }

    try {
      const orderData = {
        customer_id: customer_id,
        shipping_info: {
          name: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
        },
        payment_method: formData.payment,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total_amount: parseFloat(
          (totalPrice + (formData.payment === "cod" ? 2 : 0))
        ), // Add COD fee if applicable, fixed decimal places
      };

      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:8000/api/orders", orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate(`/order-confirmation/${response.data.order_id}`);
      } else {
        alert("Order failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Order failed:", error);
      if (error.response?.data?.errors) {
        alert("Validation error: " + JSON.stringify(error.response.data.errors));
      } else if (error.response?.data?.message) {
        alert("Order failed: " + error.response.data.message);
      } else {
        alert("Order failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-2xl">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${activeStep >= step
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-600"
                        } 
                      font-semibold`}
                    >
                      {step}
                    </div>
                    <span
                      className={`text-xs mt-2 ${activeStep >= step
                        ? "text-indigo-600 font-medium"
                        : "text-gray-500"
                        }`}
                    >
                      {step === 1
                        ? "Shipping"
                        : step === 2
                          ? "Payment"
                          : "Review"}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${activeStep > step ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
              {activeStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Shipping Information
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <input
                        type="text"
                        name="postal_code"
                        placeholder="Postal Code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="mt-8 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}

              {activeStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {/* Credit Card */}
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-indigo-500">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.payment === "card"}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-600"
                      />
                      <div className="ml-3">
                        <span className="block font-medium">
                          Credit/Debit Card
                        </span>
                        <span className="block text-sm text-gray-500">
                          Pay with Visa, Mastercard, etc.
                        </span>
                      </div>
                    </label>

                    {/* PayPal */}
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-indigo-500">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={formData.payment === "paypal"}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-600"
                      />
                      <div className="ml-3">
                        <span className="block font-medium">PayPal</span>
                        <span className="block text-sm text-gray-500">
                          Pay with your PayPal account
                        </span>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-indigo-500">
                      <input
                        type="radio"
                        name="payment"
                        value="cash_on_delivery"
                        checked={formData.payment === "cash_on_delivery"}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-600"
                      />
                      <div className="ml-3">
                        <span className="block font-medium">Cash on Delivery</span>
                        <span className="block text-sm text-gray-500">
                          Pay when you receive your order
                        </span>
                      </div>
                    </label>

                    {/* Conditional fields for card payment */}
                    {/* {formData.payment === "card" && (
                      <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card Number"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Name on Card"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                          <input
                            type="text"
                            name="cvc"
                            placeholder="CVC"
                            value={formData.cvc}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      </div>
                    )} */}
                    {formData.payment === "card" && (
                      <Elements stripe={stripePromise}>
                        <CardPayment formData={{ ...formData, totalAmount: totalPrice }} />
                      </Elements>
                    )}

                    {formData.payment === "cod" && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800">
                        <p>
                          You'll pay in cash when your order arrives. An extra $2
                          might be charged for COD orders.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      ← Back to Shipping
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-medium"
                    >
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Review Your Order
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Shipping Information
                      </h3>
                      <p className="text-gray-600">{formData.fullName}</p>
                      <p className="text-gray-600">{formData.address}</p>
                      <p className="text-gray-600">
                        {formData.city}, {formData.postal_code}
                      </p>
                      <p className="text-gray-600">{formData.email}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Payment Method
                      </h3>
                      <p className="text-gray-600">
                        {formData.payment === "card" && "Credit/Debit Card"}
                        {formData.payment === "paypal" && "PayPal"}
                        {formData.payment === "cash_on_delivery" && "Cash on Delivery"}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        ← Back to Payment
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-70"
                      >
                        {loading ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="bg-gray-200 rounded-lg w-16 h-16 animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-200 h-4 rounded animate-pulse w-3/4"></div>
                        <div className="bg-gray-200 h-4 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-2 text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cart Items with Scroll */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={`http://localhost:8000/storage/${item.product.image}`}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">${item.product.price} each</p>
                        </div>
                        <div className="font-medium text-gray-900 whitespace-nowrap">
                          ${(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    {formData.payment === "cod" && (
                      <div className="flex justify-between text-gray-600">
                        <span>COD Fee</span>
                        <span>$2.00</span>
                      </div>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-indigo-600">
                      ${(formData.payment === "cod" ? totalPrice + 2 : totalPrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

      </div>
    </div>

  )
}

