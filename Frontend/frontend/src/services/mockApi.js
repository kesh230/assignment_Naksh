/**
 * 🎭 Mock API Service for Local Development
 * Simulates backend API responses for local testing without MongoDB
 */

import { mockUsers, mockProducts, mockOrders, mockCarts } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthAPI = {
    register: async (userData) => {
        await delay(500);
        
        // Check if user already exists
        if (Object.values(mockUsers).find(u => u.email === userData.email)) {
            return {
                data: {
                    success: false,
                    message: 'User already exists with this email'
                }
            };
        }

        // Create new user
        const newUserId = '507f1f77bcf86cd799439099';
        const newUser = {
            _id: newUserId,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockUsers[newUser._id] = newUser;
        mockCarts[newUserId] = {
            _id: Math.random().toString(),
            userId: newUserId,
            totalAmount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return {
            data: {
                success: true,
                message: 'User registered successfully',
                data: {
                    userId: newUser._id,
                    username: newUser.username,
                    email: newUser.email
                }
            }
        };
    },

    login: async (email, password) => {
        await delay(500);
        
        const user = Object.values(mockUsers).find(u => u.email === email);
        
        if (!user) {
            return {
                data: {
                    success: false,
                    message: 'User not found'
                },
                status: 401
            };
        }

        // For mock, any password works
        return {
            data: {
                success: true,
                message: 'Login successful',
                data: {
                    token: 'mock-token-' + Date.now(),
                    userId: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        };
    }
};

export const mockProductAPI = {
    getAllProducts: async (limit = 20, offset = 0) => {
        await delay(300);
        const products = mockProducts.slice(offset, offset + limit);
        return {
            data: {
                success: true,
                data: products,
                total: mockProducts.length
            }
        };
    },

    getProductById: async (productId) => {
        await delay(200);
        const product = mockProducts.find(p => p._id === productId);
        
        if (!product) {
            return {
                data: {
                    success: false,
                    message: 'Product not found'
                },
                status: 404
            };
        }

        return {
            data: {
                success: true,
                data: product
            }
        };
    },

    searchProducts: async (query, limit = 20, offset = 0) => {
        await delay(300);
        const lowerQuery = query.toLowerCase();
        const filtered = mockProducts.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
        const results = filtered.slice(offset, offset + limit);
        
        return {
            data: {
                success: true,
                data: results,
                total: filtered.length
            }
        };
    }
};

export const mockOrderAPI = {
    createOrder: async (userId, products) => {
        await delay(500);
        
        let totalAmount = 0;
        const items = [];

        for (const item of products) {
            const product = mockProducts.find(p => p._id === item.productId);
            if (!product) {
                return {
                    data: {
                        success: false,
                        message: `Product ${item.productId} not found`
                    },
                    status: 404
                };
            }

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;
            items.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal
            });

            // Reduce stock
            product.quantity -= item.quantity;
        }

        const newOrder = {
            _id: 'order-' + Date.now(),
            userId,
            totalAmount,
            status: 'pending',
            items,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockOrders.push(newOrder);

        return {
            data: {
                success: true,
                message: 'Order placed successfully',
                data: {
                    orderId: newOrder._id,
                    totalAmount: newOrder.totalAmount,
                    itemCount: products.length
                }
            }
        };
    },

    getUserOrders: async (userId, limit = 10, offset = 0) => {
        await delay(300);
        const userOrders = mockOrders.filter(o => o.userId === userId);
        const results = userOrders.slice(offset, offset + limit);
        
        return {
            data: {
                success: true,
                data: results
            }
        };
    },

    getOrderDetails: async (userId, orderId) => {
        await delay(200);
        const order = mockOrders.find(o => o._id === orderId && o.userId === userId);
        
        if (!order) {
            return {
                data: {
                    success: false,
                    message: 'Order not found'
                },
                status: 404
            };
        }

        return {
            data: {
                success: true,
                data: order
            }
        };
    }
};

export const mockCartAPI = {
    getCart: async (userId) => {
        await delay(200);
        const cart = mockCarts[userId];
        
        if (!cart) {
            return {
                data: {
                    success: false,
                    message: 'Cart not found'
                },
                status: 404
            };
        }

        return {
            data: {
                success: true,
                data: cart
            }
        };
    },

    getCartItems: async (userId) => {
        await delay(200);
        return {
            data: {
                success: true,
                data: []
            }
        };
    },

    addToCart: async (userId, productId, quantity) => {
        await delay(300);
        return {
            data: {
                success: true,
                message: 'Item added to cart',
                data: { cartItemId: 'item-' + Date.now() }
            }
        };
    },

    clearCart: async (userId) => {
        await delay(200);
        if (mockCarts[userId]) {
            mockCarts[userId].totalAmount = 0;
        }
        return {
            data: {
                success: true,
                message: 'Cart cleared'
            }
        };
    }
};

export default {
    authAPI: mockAuthAPI,
    productAPI: mockProductAPI,
    orderAPI: mockOrderAPI,
    cartAPI: mockCartAPI
};
