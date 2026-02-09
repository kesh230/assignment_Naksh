import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        fullName: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: '',
        state: '',
        zipcode: '',
        paymentMethod: 'card'
    });

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Checkout</h2>
                    <p className="text-gray-600 mb-8">Your cart is empty. Add items to proceed with checkout.</p>
                    <Link
                        to="/"
                        className="inline-block px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                    >
                        Back to Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setError(null);

            // Validate form
            if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
                setError('Please fill in all required fields');
                return;
            }

            // Prepare order products
            const products = cartItems.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity
            }));

            // Create order
            const response = await orderAPI.createOrder(user._id, products);

            if (response.data.success) {
                // Clear cart and redirect to success page
                clearCart();
                navigate('/order-success', {
                    state: {
                        orderId: response.data.data.orderId,
                        totalAmount: response.data.data.totalAmount
                    }
                });
            } else {
                setError(response.data.message || 'Failed to place order');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error placing order');
        } finally {
            setLoading(false);
        }
    };

    const taxAmount = totalAmount * 0.18;
    const finalTotal = totalAmount + taxAmount;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-8">
                {/* Shipping & Payment Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                                />

                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                                />

                                <textarea
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                                ></textarea>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="zipcode"
                                    placeholder="Zip Code"
                                    value={formData.zipcode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                            <div className="space-y-3">
                                {['card', 'upi', 'netbanking', 'cod'].map((method) => (
                                    <label key={method} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={formData.paymentMethod === method}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 font-medium capitalize">
                                            {method === 'cod' ? 'Cash on Delivery' : method.toUpperCase()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-bold disabled:bg-gray-400"
                        >
                            {loading ? 'Processing...' : `Place Order (₹${finalTotal.toFixed(2)})`}
                        </button>

                        <Link
                            to="/cart"
                            className="w-full block text-center py-2 text-pink-600 hover:underline text-sm"
                        >
                            Back to Cart
                        </Link>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white border border-gray-300 rounded-lg p-6 sticky top-8">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        {/* Items */}
                        <div className="space-y-3 mb-4 border-b pb-4 max-h-64 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div key={item.productId._id} className="flex justify-between text-sm">
                                    <div>
                                        <p className="font-medium">{item.productId.name}</p>
                                        <p className="text-gray-600">x{item.quantity}</p>
                                    </div>
                                    <span className="font-medium">₹{(item.productId.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-green-600 font-semibold">FREE</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (18%)</span>
                                <span>₹{taxAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Amount</span>
                                <span className="text-pink-600">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* guarantees */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="font-bold mb-2 text-sm">Secure Checkout</h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>✓ 100% Secure Payment</li>
                                <li>✓ 7-day Easy Returns</li>
                                <li>✓ Free Shipping</li>
                                <li>✓ 100% Authentic</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
