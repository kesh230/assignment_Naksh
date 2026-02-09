import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Register from './pages/Register';

import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="flex flex-col min-h-screen bg-gray-50">
                        <Navbar />
                        
                        <main className="flex-grow">
                            <Routes>
                                {/* Home & Products */}
                                <Route path="/" element={<Products />} />
                                <Route path="/search" element={<Products />} />
                                <Route path="/product/:productId" element={<ProductDetail />} />

                                {/* Cart & Checkout */}
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/order-success" element={<OrderSuccess />} />

                                {/* Auth */}
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />

                                {/* User */}
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/orders" element={<Orders />} />

                                {/* 404 */}
                                <Route
                                    path="*"
                                    element={
                                        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                                            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                                            <a
                                                href="/"
                                                className="inline-block px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                                            >
                                                Back to Home
                                            </a>
                                        </div>
                                    }
                                />
                            </Routes>
                        </main>

                        <Footer />
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
