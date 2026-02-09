import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [popularity, setPopularity] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const [productRes, popRes] = await Promise.all([
                    productAPI.getProductById(productId),
                    productAPI.getProductPopularity(productId).catch(() => null)
                ]);

                setProduct(productRes.data.data);
                if (popRes?.data?.data) {
                    setPopularity(popRes.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error loading product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (product.quantity < quantity) {
            alert('Insufficient stock');
            return;
        }
        addToCart(product, quantity);
        alert(`${quantity} item(s) added to cart!`);
        setQuantity(1);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">Loading product details...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center text-red-600">{error || 'Product not found'}</div>
                <Link to="/" className="text-pink-600 hover:underline mt-4 block">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6 text-sm text-gray-600">
                <Link to="/" className="hover:text-pink-600">Home</Link>
                <span className="mx-2">/</span>
                <Link to={`/?category=${product.category}`} className="hover:text-pink-600">
                    {product.category}
                </Link>
                <span className="mx-2">/</span>
                <span>{product.name}</span>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <img
                        src={product.imageUrl || '📷'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-500">⭐ 4.5</span>
                        <span className="text-gray-600">| 2.5K reviews</span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-pink-600">₹{product.price}</span>
                            <span className="text-lg text-gray-500 line-through">₹{(product.price * 1.2).toFixed(2)}</span>
                            <span className="text-lg text-green-600 font-semibold">(50% OFF)</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-bold mb-2">Description</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-6">
                        <h3 className="font-bold mb-2">Availability</h3>
                        <p className={`${product.quantity > 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                            {product.quantity > 0 ? `✓ In Stock (${product.quantity} available)` : '✗ Out of Stock'}
                        </p>
                    </div>

                    {/* Quantity Selector */}
                    {product.quantity > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold mb-2">Quantity</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
                                product.quantity > 0
                                    ? 'bg-pink-600 hover:bg-pink-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {product.quantity > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                        </button>
                        <button className="flex-1 py-3 rounded-lg font-bold border-2 border-pink-600 text-pink-600 hover:bg-pink-50 transition">
                            ❤️ Wishlist
                        </button>
                    </div>

                    {/* Seller Info */}
                    {product.userId && (
                        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                            <h3 className="font-bold mb-2">Sold by</h3>
                            <p className="text-gray-700">{product.userId.username || 'ShopHub Seller'}</p>
                        </div>
                    )}

                    {/* Popularity Stats */}
                    {popularity && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-bold mb-3">Popular Stats</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{popularity.inCarts}</p>
                                    <p className="text-sm text-gray-600">In Carts</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{popularity.inOrders}</p>
                                    <p className="text-sm text-gray-600">Ordered</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{popularity.totalSold}</p>
                                    <p className="text-sm text-gray-600">Total Sold</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Info */}
                    <div className="mt-6 space-y-2 text-sm text-gray-600">
                        <p>✓ Free Shipping on orders above ₹500</p>
                        <p>✓ 7 Days Return Policy</p>
                        <p>✓ Secure Checkout</p>
                        <p>✓ 100% Authentic Products</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
