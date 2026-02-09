import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">My Profile</h2>
                    <p className="text-gray-600 mb-8">Please login to view your profile.</p>
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white border border-gray-300 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 font-semibold">Full Name</label>
                                <p className="text-lg">{user?.username || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm text-gray-600 font-semibold">Email Address</label>
                                <p className="text-lg">{user?.email || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm text-gray-600 font-semibold">Phone Number</label>
                                <p className="text-lg">{user?.phone || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm text-gray-600 font-semibold">Delivery Address</label>
                                <p className="text-lg">{user?.address || 'N/A'}</p>
                            </div>
                        </div>

                        <button className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-bold">
                            Edit Profile
                        </button>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white border border-gray-300 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Security</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-600 font-semibold">Password</label>
                                <p className="text-lg">••••••••</p>
                            </div>
                        </div>

                        <button className="mt-6 px-6 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition font-bold">
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Quick Links */}
                    <div className="bg-white border border-gray-300 rounded-lg p-6">
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link
                                to="/orders"
                                className="block text-pink-600 hover:text-pink-700 font-semibold py-2"
                            >
                                My Orders
                            </Link>
                            <a href="#" className="block text-pink-600 hover:text-pink-700 font-semibold py-2">
                                My Wishlist
                            </a>
                            <a href="#" className="block text-pink-600 hover:text-pink-700 font-semibold py-2">
                                Saved Addresses
                            </a>
                            <a href="#" className="block text-pink-600 hover:text-pink-700 font-semibold py-2">
                                Reviews & Ratings
                            </a>
                        </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="bg-white border border-gray-300 rounded-lg p-6">
                        <h3 className="font-bold mb-4">Account Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Orders</span>
                                <span className="font-bold">5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Spent</span>
                                <span className="font-bold">₹15,999</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loyalty Points</span>
                                <span className="font-bold text-pink-600">1,599</span>
                            </div>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-bold mb-2">Member Since</h3>
                        <p className="text-sm text-gray-600">January 2024</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
