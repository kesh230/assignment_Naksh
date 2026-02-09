import { Link, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId || 'N/A';
    const totalAmount = location.state?.totalAmount || 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
                {/* Success Icon */}
                <div className="mb-8 text-6xl">
                    ✓
                </div>

                <h1 className="text-4xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>

                <p className="text-gray-600 text-lg mb-8">
                    Thank you for your order. Your order has been confirmed and will be shipped soon.
                </p>

                {/* Order Details */}
                <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Order Details</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between pb-4 border-b">
                            <span className="text-gray-600 font-medium">Order ID</span>
                            <span className="font-semibold">{orderId}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b">
                            <span className="text-gray-600 font-medium">Total Amount</span>
                            <span className="font-semibold text-pink-600 text-lg">₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pb-4 border-b">
                            <span className="text-gray-600 font-medium">Status</span>
                            <span className="font-semibold text-blue-600">Pending</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">Expected Delivery</span>
                            <span className="font-semibold">3-5 Business Days</span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-bold mb-2">Next Steps</h3>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>✓ You will receive a confirmation email shortly</li>
                            <li>✓ Track your order from your profile</li>
                            <li>✓ Delivery updates will be sent via SMS</li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Link
                        to="/orders"
                        className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-bold"
                    >
                        Track Order
                    </Link>
                    <Link
                        to="/"
                        className="px-8 py-3 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition font-bold"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Shipping Info */}
                <div className="mt-12 grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl mb-2">📦</p>
                        <p className="font-bold text-sm">Free Shipping</p>
                        <p className="text-xs text-gray-600">On orders above ₹500</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl mb-2">↩️</p>
                        <p className="font-bold text-sm">7-Day Returns</p>
                        <p className="text-xs text-gray-600">Easy return policy</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl mb-2">🛡️</p>
                        <p className="font-bold text-sm">100% Secure</p>
                        <p className="text-xs text-gray-600">Safe & encrypted</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
