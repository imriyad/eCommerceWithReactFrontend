import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const RecommendedProducts = () => {
    const { user } = useAuth();
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
      const apiUrl = process.env.REACT_APP_API_URL; // CRA

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const res = await axios.get(
                    `${apiUrl}/api/customer/recommended/${user.id}`
                );
                
                // Fetch ratings for each recommended product
                const productsWithRatings = await Promise.all(
                    res.data.recommended.map(async (product) => {
                        try {
                            const reviewRes = await axios.get(
                                `${apiUrl}/api/reviews/product/${product.id}`
                            );
                            const avgRating = reviewRes.data.avg_rating || 0;
                            return { ...product, avgRating };
                        } catch (err) {
                            console.error(`Error fetching rating for product ${product.id}`, err);
                            return { ...product, avgRating: 0 };
                        }
                    })
                );
                
                setRecommended(productsWithRatings);
            } catch (err) {
                console.error("Failed to fetch recommended products:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchRecommended();
    }, [user]);

    if (loading) return <p>Loading recommendations...</p>;

    return (
        <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>

            {recommended.length === 0 ? (
                <p className="text-gray-500">No recommendations available right now.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommended.map((product) => (
                        <Link
                            to={`/product/${product.id}`} 
                            key={product.id}
                            className="group bg-white rounded-xl shadow p-4 hover:shadow-lg transition block"
                        >
                            <div className="relative overflow-hidden h-40 rounded-md">
                                <img
                                    src={`http://localhost:8000/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {product.discount_price && product.discount_price < product.price && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="mt-2 text-lg font-semibold line-clamp-1">{product.name}</h3>
                            
                            {/* Rating display */}
                            <div className="flex items-center mt-1">
                                {[1, 2, 3, 4, 5].map((star) =>
                                    star <= Math.round(product.avgRating) ? (
                                        <FaStar key={star} className="text-yellow-400 w-3 h-3" />
                                    ) : (
                                        <FaRegStar key={star} className="text-yellow-400 w-3 h-3" />
                                    )
                                )}
                                <span className="text-xs text-gray-500 ml-1">({product.avgRating.toFixed(1)})</span>
                            </div>
                            
                            {/* Price display */}
                            <div className="flex items-center justify-between mt-2">
                                <div>
                                    {product.discount_price && product.discount_price < product.price ? (
                                        <>
                                            <span className="font-bold text-gray-900">${product.discount_price}</span>
                                            <span className="text-xs text-gray-500 line-through ml-1">${product.price}</span>
                                        </>
                                    ) : (
                                        <span className="font-bold text-gray-900">${product.price}</span>
                                    )}
                                </div>
                                <button
                                    className="text-gray-500 hover:text-indigo-600 transition-colors"
                                    aria-label="Add to cart"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Add to cart functionality here
                                    }}
                                >
                                    <FiShoppingCart className="w-4 h-4" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default RecommendedProducts;