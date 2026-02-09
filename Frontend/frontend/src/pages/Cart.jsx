import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cartItems, totalAmount, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
    const { isAuthenticated } = useAuth();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Add items to your cart and then come back here to check out.</p>
                    <Link
                        to="/"
                        className="inline-block px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>

            <div className="grid grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.productId?._id}
                            className="flex gap-4 p-4 bg-white border border-gray-300 rounded-lg hover:shadow-lg transition"
                        >
                            {/* Product Image */}
                            <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0">
                                <img
                                    src={item.productId?.imageUrl || '📷'}
                                    alt={item.productId?.name}
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                                <Link
                                    to={`/product/${item.productId?._id}`}
                                    className="block font-semibold hover:text-pink-600 mb-1"
                                >
                                    {item.productId?.name}
                                </Link>
                                <p className="text-sm text-gray-600 mb-2">{item.productId?.category}</p>
                                <p className="font-bold text-pink-600">₹{item.productId?.price}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 border border-gray-300 rounded">
                                <button
                                    onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}
                                    className="px-3 py-2 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-4 font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}
                                    className="px-3 py-2 hover:bg-gray-100"
                                    disabled={item.quantity >= item.productId?.quantity}
                                >
                                    +
                                </button>
                            </div>

                            {/* Subtotal */}
                            <div className="w-24 text-right">
                                <p className="font-bold">₹{(item.productId?.price * item.quantity).toFixed(2)}</p>
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromCart(item.productId?._id)}
                                className="text-red-600 hover:bg-red-50 px-4 py-2 rounded transition"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                        Clear Cart
                    </button>
                </div>

                {/* Cart Summary */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                    <div className="space-y-3 mb-4 border-b pb-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-green-600 font-semibold">FREE</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>₹{(totalAmount * 0.18).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-lg font-bold mb-6">
                        <span>Total</span>
                        <span className="text-pink-600">₹{(totalAmount * 1.18).toFixed(2)}</span>
                    </div>

                    {isAuthenticated ? (
                        <Link
                            to="/checkout"
                            className="w-full block text-center py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-bold"
                        >
                            Proceed to Checkout
                        </Link>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                to="/login"
                                className="w-full block text-center py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-bold"
                            >
                                Login to Checkout
                            </Link>
                            <Link
                                to="/register"
                                className="w-full block text-center py-3 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition font-bold"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}

                    <Link
                        to="/"
                        className="w-full block text-center py-2 mt-3 text-pink-600 hover:underline text-sm"
                    >
                        Continue Shopping
                    </Link>

                    {/* Offers */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-bold mb-2 text-sm">Special Offers</h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>✓ Free shipping on this order</li>
                            <li>✓ 7-day returns</li>
                            <li>✓ Secure checkout</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
