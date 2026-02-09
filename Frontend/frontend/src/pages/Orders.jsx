import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

export default function Orders() {
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await orderAPI.getUserOrders(user._id);
                setOrders(response.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Error loading orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">My Orders</h2>
                    <p className="text-gray-600 mb-8">Please login to view your orders.</p>
                    <Link
                        to="/login"
                        className="inline-block px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                    >
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet.</p>
                    <Link
                        to="/"
                        className="inline-block px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                            onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-pink-600">₹{order.totalAmount.toFixed(2)}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Expand/Collapse for Details */}
                            {selectedOrder?._id === order._id && (
                                <OrderDetails order={order} />
                            )}

                            {selectedOrder?._id !== order._id && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Click to view details
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function OrderDetails({ order }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await orderAPI.getOrderItems(order._id);
                setItems(response.data.data || []);
            } catch (err) {
                console.error('Error loading order items:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [order._id]);

    return (
        <div className="mt-4 pt-4 border-t">
            <h4 className="font-bold mb-3">Order Items</h4>
            {loading ? (
                <p className="text-gray-600">Loading items...</p>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                            <div>
                                <p className="font-medium">{item.productId?.name}</p>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <span className="font-medium">₹{item.subtotal?.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition text-sm font-bold">
                    Track Order
                </button>
                <button className="flex-1 py-2 border border-pink-600 text-pink-600 rounded hover:bg-pink-50 transition text-sm font-bold">
                    Contact Support
                </button>
            </div>
        </div>
    );
}
