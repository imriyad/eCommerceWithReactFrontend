import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SpecialOffers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

      const apiUrl = process.env.REACT_APP_API_URL; // CRA

    useEffect(() => {
        document.title = "ShopEase - Special Offers";
        const fetchData = async () => {
            try {
                setLoading(true);

                const [offersRes, productsRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/promotions/active`),
                    axios.get(`${apiUrl}/api/products`)
                ]);

                const offers = offersRes.data;
                const products = productsRes.data;

                // Attach offers to products
                const productsWithOffers = products.map((product) => {
                    const productOffers = offers.filter(
                        (offer) =>
                            offer.applicable_products &&
                            offer.applicable_products.some((id) => Number(id) === product.id)
                    );
                    return { ...product, promotions: productOffers };
                });

                setProducts(productsWithOffers.filter((p) => p.promotions.length > 0));
            } catch (err) {
                setError("Failed to fetch data");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );

    if (error)
        return (
            // <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">

                <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );

    return (
        // <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    {/* <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Special{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                            Deals
                        </span>
                    </h1> */}

                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                        Special <span className="text-yellow-400">Deals</span>
                    </h1>
                    {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto"> */}
                    <p className="text-base text-white/80 max-w-xl mx-auto">

                        Discover products with exclusive promotions applied. Grab them before the deals end!
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto">
                        <div className="text-6xl mb-6">🎁</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Promotions</h2>
                        <p className="text-gray-600 mb-6">
                            There are no special offers on products at the moment. Check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <Link
                                to={`/product/${product.id}`} // Navigate to product details page
                                key={product.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                            >
                                {/* Product Image */}
                                <div className="relative h-60">
                                    <img
                                        src={`http://localhost:8000/storage/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>


                                {/* Promotion Badges */}
                                {product.promotions.length > 0 && (
                                    <div className="p-4 flex flex-wrap gap-2">
                                        {product.promotions.map((promo, index) => (
                                            <span
                                                key={index}
                                                className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                                            >
                                                {promo.type === "percentage"
                                                    ? `${promo.value}% OFF`
                                                    : promo.type === "discount"
                                                        ? `$${promo.value} OFF`
                                                        : promo.type === "bogo"
                                                            ? "Buy 1 Get 1 Free"
                                                            : promo.type === "free_shipping"
                                                                ? "Free Shipping"
                                                                : promo.type}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Product Details */}
                                <div className="p-4 pt-0">
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="text-gray-600 text-sm">{product.promotions[0]?.description}</p>

                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold text-indigo-600">
                                            ${product.discount_price || product.price}
                                        </span>
                                        {product.promotions.length > 0 && (
                                            <span className="text-xs text-gray-500">
                                                Valid until: {formatDate(product.promotions[0].end_date)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecialOffers;
