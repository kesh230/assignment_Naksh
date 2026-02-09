import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showMenu, setShowMenu] = React.useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white text-sm py-2">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-300">24/7 Customer Care</a>
                        <a href="#" className="hover:text-gray-300">Track Orders</a>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-300">Returns & Exchange</a>
                        <a href="#" className="hover:text-gray-300">FAQ</a>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <div className="text-2xl font-bold text-pink-600">ShopHub</div>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 text-gray-500 hover:text-pink-600"
                            >
                                🔍
                            </button>
                        </div>
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                👤
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-2 border-b font-semibold">
                                                {user?.username}
                                            </div>
                                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                                My Profile
                                            </Link>
                                            <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowMenu(false);
                                                    window.location.href = '/';
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                                                Login
                                            </Link>
                                            <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 border-t">
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                            ❤️
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                            🛒
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-8 mt-4 border-t pt-4 text-sm font-medium">
                    <Link to="/?category=men" className="hover:text-pink-600">Men</Link>
                    <Link to="/?category=women" className="hover:text-pink-600">Women</Link>
                    <Link to="/?category=kids" className="hover:text-pink-600">Kids</Link>
                    <Link to="/?category=electronics" className="hover:text-pink-600">Electronics</Link>
                    <Link to="/?category=accessories" className="hover:text-pink-600">Accessories</Link>
                    <Link to="/?category=home" className="hover:text-pink-600">Home</Link>
                </div>
            </div>
        </nav>
    );
}
