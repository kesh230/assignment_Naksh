import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            if (!formData.email || !formData.password) {
                setError('Please fill in all fields');
                return;
            }

            // Call real backend login API
            const response = await authAPI.login(formData.email, formData.password);

            if (response.data.success) {
                // Store user data in context
                const userData = response.data.data;
                // Map userId from backend to _id for frontend compatibility
                const userToStore = {
                    ...userData,
                    _id: userData.userId
                };
                login(userToStore, userData.token || '');
                
                // Redirect to home
                navigate('/');
                alert('✅ Login successful!');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-pink-600">Login</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-600"
                        required
                    />

                    <div className="flex justify-between text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Remember me
                        </label>
                        <a href="#" className="text-pink-600 hover:text-pink-700">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-bold disabled:bg-gray-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-pink-600 hover:text-pink-700 font-bold">
                        Register here
                    </Link>
                </p>

                {/* Test Credentials */}
                <div className="mt-8 pt-6 border-t">
                    <p className="text-sm text-gray-600 font-semibold mb-3">📝 Test Login</p>
                    <p className="text-xs text-gray-500 mb-2">
                        <strong>Email:</strong> john@example.com<br/>
                        <strong>Password:</strong> securePassword123
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                        💡 Register a new account first, then login with those credentials
                    </p>
                </div>
            </div>
        </div>
    );
}
