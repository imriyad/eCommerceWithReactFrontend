import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function Reviews({ onSuccess }) {
  const { user } = useAuth();
  const location = useLocation();
  const productId = location.state?.productId;
  const productName = location.state?.productName || "this product";
  const productImage = location.state?.productImage;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!productId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center transform transition-all duration-300 hover:shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you're trying to review. 
            Please go back and try again.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      alert("You must be logged in to submit a review.");
      setIsSubmitting(false);
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8000/api/reviews/${user.id}/${productId}`,
        { rating, comment }
      );

      setShowSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(res.data.review);
        setRating(0);
        setComment("");
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 422) {
        console.error("Validation errors:", err.response.data);
        alert("Validation failed! Check console for details.");
      } else {
        console.error(err);
        alert("Failed to add review");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-2xl text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Review Submitted!</h3>
            <p className="text-gray-600">Thank you for sharing your experience.</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Share Your Experience
          </h1>
          <p className="text-lg text-gray-600">Help others by reviewing {productName}</p>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          {/* Product Card Header */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center">
              {productImage && (
                <img src={productImage} alt={productName} className="w-16 h-16 rounded-lg object-cover mr-4 border-2 border-white" />
              )}
              <div>
                <h2 className="text-xl font-semibold">Reviewing {productName}</h2>
                <p className="text-blue-100 mt-1">Your honest opinion helps others</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Rating Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How would you rate this product? *
              </label>
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={index}
                      className={`text-4xl cursor-pointer transition-all duration-200 ${
                        ratingValue <= (hover || rating)
                          ? "text-yellow-400 transform scale-110"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      aria-label={`Rate ${ratingValue} out of 5 stars`}
                    >
                      {ratingValue <= (hover || rating) ? "★" : "☆"}
                    </button>
                  );
                })}
              </div>
              <div className="text-center mt-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  rating === 0 ? 'bg-gray-100 text-gray-500' : 
                  rating <= 2 ? 'bg-red-100 text-red-800' :
                  rating <= 4 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {rating === 0 ? 'Select your rating' : 
                   rating === 1 ? 'Poor' :
                   rating === 2 ? 'Fair' :
                   rating === 3 ? 'Good' :
                   rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </div>
            </div>
            
            {/* Comment Section */}
            <div className="mb-8">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-3">
                Share your experience
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike? How did the product perform? Would you recommend it to others?"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">Your review will be posted publicly</p>
                <p className="text-xs text-gray-500">{comment.length}/500 characters</p>
              </div>
            </div>
            
            {/* User Info & Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Reviewing as</p>
                  <p className="text-sm text-gray-500">{user?.name || user?.email}</p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="relative py-3 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Submit Review
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines Card */}
        <div className="mt-8 bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Review Guidelines
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 text-sm">1</span>
                </div>
                <p className="text-gray-600">Be specific about your experience with the product</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 text-sm">2</span>
                </div>
                <p className="text-gray-600">Mention pros and cons you've noticed</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 text-sm">3</span>
                </div>
                <p className="text-gray-600">Don't include personal information or promotional content</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 text-sm">4</span>
                </div>
                <p className="text-gray-600">Your review should be honest and based on actual experience</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reviews;