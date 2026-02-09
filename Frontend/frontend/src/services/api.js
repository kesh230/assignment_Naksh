import axios from 'axios';
import { mockAuthAPI, mockProductAPI, mockCartAPI, mockOrderAPI } from './mockApi';

// Detect if running in mock or dev mode
const isMockMode = import.meta.env.VITE_MODE === 'mock' || import.meta.env.MODE === 'mock';

console.log(`🚀 API Mode: ${isMockMode ? 'MOCK (Mock Data)' : 'DEV (MongoDB Backend)'}`);

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance for backend API
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============================================
// 🔀 CONDITIONAL API EXPORTS
// ============================================

// Auth APIs
export const authAPI = isMockMode ? mockAuthAPI : {
    register: (userData) => api.post('/auth/register', userData),
    login: (email, password) => api.post('/auth/login', { email, password })
};

// Product APIs
export const productAPI = isMockMode ? mockProductAPI : {
    // Get all products with pagination
    getAllProducts: (limit = 20, offset = 0) => 
        api.get('/product', { params: { limit, offset } }),
    
    // Get single product
    getProductById: (productId) => 
        api.get(`/product/${productId}`),
    
    // Search products
    searchProducts: (query, limit = 20, offset = 0) => 
        api.get('/product/search', { params: { query, limit, offset } }),
    
    // Get products by user (seller)
    getProductsByUser: (userId, limit = 20, offset = 0) => 
        api.get(`/product/user/${userId}`, { params: { limit, offset } }),
    
    // Check stock
    checkStock: (productId, quantity) => 
        api.get('/product/stock/check', { params: { productId, quantity } }),
    
    // Get product popularity
    getProductPopularity: (productId) => 
        api.get(`/product/${productId}/popularity`)
};

// Cart APIs
export const cartAPI = isMockMode ? mockCartAPI : {
    // Get user's cart
    getCart: (userId) => 
        api.get(`/cart/${userId}`),
    
    // Get cart items
    getCartItems: (userId) => 
        api.get(`/cart/${userId}/items`),
    
    // Add to cart
    addToCart: (userId, productId, quantity) => 
        api.post(`/cart/${userId}/add`, { productId, quantity }),
    
    // Update cart item quantity
    updateCartItem: (userId, cartItemId, quantity) => 
        api.put(`/cart/${userId}/update`, { cartItemId, quantity }),
    
    // Remove from cart
    removeFromCart: (userId, cartItemId) => 
        api.delete(`/cart/${userId}/remove`, { data: { cartItemId } }),
    
    // Clear cart
    clearCart: (userId) => 
        api.delete(`/cart/${userId}/clear`),
    
    // Get cart summary
    getCartSummary: (userId) => 
        api.get(`/cart/${userId}/summary`)
};

// Order APIs
export const orderAPI = isMockMode ? mockOrderAPI : {
    // Create order
    createOrder: (userId, products) => 
        api.post(`/order/${userId}`, { products }),
    
    // Get user orders
    getUserOrders: (userId, limit = 10, offset = 0) => 
        api.get(`/order/${userId}`, { params: { limit, offset } }),
    
    // Get order details
    getOrderDetails: (userId, orderId) => 
        api.get(`/order/${userId}/${orderId}`),
    
    // Get all orders (admin)
    getAllOrders: (limit = 10, offset = 0) => 
        api.get('/order', { params: { limit, offset } }),
    
    // Update order status
    updateOrderStatus: (orderId, status) => 
        api.put(`/order/${orderId}/status`, { status }),
    
    // Get order statistics
    getOrderStatistics: (userId = null) => 
        api.get('/order/stats/all', { params: { userId } }),
    
    // Get order items
    getOrderItems: (orderId) => 
        api.get(`/order/${orderId}/items`),
    
    // Get seller sales
    getSellerSales: (userId, limit = 10, offset = 0) => 
        api.get(`/order/sales/${userId}`, { params: { limit, offset } }),
    
    // Get seller sales statistics
    getSellerSalesStats: (userId) => 
        api.get(`/order/sales/${userId}/stats`)
};

export default api;
