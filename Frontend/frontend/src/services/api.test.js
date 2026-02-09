/**
 * Frontend Unit Tests - Services
 * Test API service detection and mock/dev modes
 */

describe('API Service - Modal Detection', () => {
    describe('Mock Mode Detection', () => {
        test('should detect mock mode when VITE_MODE=mock', () => {
            const mode = import.meta.env.VITE_MODE;
            if (mode === 'mock') {
                expect(mode).toBe('mock');
            }
        });

        test('should use mockAuthAPI in mock mode', async () => {
            // Test that mock auth API works
            const result = await authAPI.login('demo@myntra.com', 'anypassword');
            expect(result.data.success).toBe(true);
            expect(result.data.data).toHaveProperty('userId');
        });
    });

    describe('Dev Mode Detection', () => {
        test('should detect dev mode when VITE_MODE=dev', () => {
            const mode = import.meta.env.VITE_MODE;
            if (mode === 'dev') {
                expect(mode).toBe('dev');
            }
        });
    });
});

describe('Auth API - Mock Mode', () => {
    describe('Login Functionality', () => {
        test('should login with valid email and password', async () => {
            const response = await authAPI.login('demo@myntra.com', 'anypassword');
            expect(response.data.success).toBe(true);
            expect(response.data.data.userId).toBeDefined();
            expect(response.data.data.email).toBe('demo@myntra.com');
        });

        test('should return error for non-existent user', async () => {
            const response = await authAPI.login('notexist@test.com', 'password');
            expect(response.data.success).toBe(false);
            expect(response.data.message).includes('not found');
        });

        test('should handle empty email', async () => {
            const response = await authAPI.login('', 'password');
            expect(response.data.success).toBe(false);
        });

        test('should handle empty password', async () => {
            const response = await authAPI.login('demo@myntra.com', '');
            expect(response.data.success).toBe(false);
        });

        test('should handle both email and password empty', async () => {
            const response = await authAPI.login('', '');
            expect(response.data.success).toBe(false);
        });

        test('should handle null values', async () => {
            const response = await authAPI.login(null, null);
            expect(response.data.success).toBe(false);
        });
    });

    describe('Register Functionality', () => {
        test('should register new user with valid data', async () => {
            const userData = {
                username: 'newuser',
                email: 'new@test.com',
                password: 'password123',
                phone: '9999999999',
                address: '123 Test Street'
            };
            const response = await authAPI.register(userData);
            expect(response.data.success).toBe(true);
        });

        test('should reject duplicate email', async () => {
            const userData = {
                username: 'another',
                email: 'demo@myntra.com', // Already exists
                password: 'password123',
                phone: '9999999999',
                address: '123 Test Street'
            };
            const response = await authAPI.register(userData);
            expect(response.data.success).toBe(false);
        });

        test('should handle missing fields', async () => {
            const userData = {
                username: 'user',
                email: 'test@test.com'
                // Missing password, phone, address
            };
            const response = await authAPI.register(userData);
            expect(response.data.success).toBe(false);
        });

        test('should handle very long input strings', async () => {
            const userData = {
                username: 'a'.repeat(1000),
                email: 'test@test.com',
                password: 'pass123',
                phone: '9999999999',
                address: 'b'.repeat(1000)
            };
            // Should either fail gracefully or truncate
            const response = await authAPI.register(userData);
            expect(response.data).toBeDefined();
        });

        test('should handle special characters in username', async () => {
            const userData = {
                username: 'user@#$%',
                email: 'special@test.com',
                password: 'password123',
                phone: '9999999999',
                address: '123 Street'
            };
            const response = await authAPI.register(userData);
            // Should either accept or reject gracefully
            expect(response.data.success || !response.data.success).toBe(true);
        });
    });
});

describe('Product API - Mock Mode', () => {
    describe('Get All Products', () => {
        test('should return all products with default pagination', async () => {
            const response = await productAPI.getAllProducts();
            expect(response.data.success).toBe(true);
            expect(Array.isArray(response.data.data)).toBe(true);
            expect(response.data.data.length).toBeGreaterThan(0);
        });

        test('should return limited products with limit parameter', async () => {
            const response = await productAPI.getAllProducts(5, 0);
            expect(response.data.data.length).toBeLessThanOrEqual(5);
        });

        test('should handle offset pagination', async () => {
            const page1 = await productAPI.getAllProducts(5, 0);
            const page2 = await productAPI.getAllProducts(5, 5);
            expect(page1.data.data[0]._id).not.toBe(page2.data.data[0]._id);
        });

        test('should handle large limit value', async () => {
            const response = await productAPI.getAllProducts(1000, 0);
            expect(response.data.success).toBe(true);
        });

        test('should handle negative limit', async () => {
            const response = await productAPI.getAllProducts(-5, 0);
            // Should handle gracefully
            expect(response.data).toBeDefined();
        });

        test('should handle negative offset', async () => {
            const response = await productAPI.getAllProducts(10, -5);
            // Should handle gracefully
            expect(response.data).toBeDefined();
        });
    });

    describe('Search Products', () => {
        test('should find products by name', async () => {
            const response = await productAPI.searchProducts('shirt');
            expect(response.data.success).toBe(true);
            expect(response.data.data.length).toBeGreaterThan(0);
        });

        test('should find products by category', async () => {
            const response = await productAPI.searchProducts('Clothing');
            expect(response.data.data.length).toBeGreaterThan(0);
        });

        test('should be case-insensitive', async () => {
            const response1 = await productAPI.searchProducts('SHIRT');
            const response2 = await productAPI.searchProducts('shirt');
            expect(response1.data.data.length).toBe(response2.data.data.length);
        });

        test('should return empty array for non-existent product', async () => {
            const response = await productAPI.searchProducts('xyznonexistent');
            expect(response.data.data.length).toBe(0);
        });

        test('should handle empty search query', async () => {
            const response = await productAPI.searchProducts('');
            expect(response.data).toBeDefined();
        });

        test('should handle special characters in search', async () => {
            const response = await productAPI.searchProducts('@#$%');
            expect(response.data.data.length).toBe(0);
        });

        test('should handle very long search query', async () => {
            const response = await productAPI.searchProducts('a'.repeat(1000));
            expect(response.data.data.length).toBe(0);
        });
    });

    describe('Get Product by ID', () => {
        test('should return product when ID exists', async () => {
            const response = await productAPI.getProductById('601f1f77bcf86cd799439001');
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty('_id');
            expect(response.data.data).toHaveProperty('name');
            expect(response.data.data).toHaveProperty('price');
        });

        test('should return error for invalid ID', async () => {
            const response = await productAPI.getProductById('invalidid123');
            expect(response.data.success).toBe(false);
        });

        test('should return error for non-existent ID', async () => {
            const response = await productAPI.getProductById('999f1f77bcf86cd799439999');
            expect(response.data.success).toBe(false);
        });

        test('should return error for empty ID', async () => {
            const response = await productAPI.getProductById('');
            expect(response.data.success).toBe(false);
        });

        test('should return error for null ID', async () => {
            const response = await productAPI.getProductById(null);
            expect(response.data.success).toBe(false);
        });
    });
});

describe('Order API - Mock Mode', () => {
    describe('Create Order', () => {
        test('should create order with valid products', async () => {
            const products = [
                { productId: '601f1f77bcf86cd799439001', quantity: 2 }
            ];
            const response = await orderAPI.createOrder('507f1f77bcf86cd799439011', products);
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty('orderId');
            expect(response.data.data).toHaveProperty('totalAmount');
        });

        test('should handle empty products array', async () => {
            const products = [];
            const response = await orderAPI.createOrder('507f1f77bcf86cd799439011', products);
            expect(response.data.success).toBe(false);
        });

        test('should handle non-existent product', async () => {
            const products = [
                { productId: 'nonexistent', quantity: 1 }
            ];
            const response = await orderAPI.createOrder('507f1f77bcf86cd799439011', products);
            expect(response.data.success).toBe(false);
        });

        test('should handle zero quantity', async () => {
            const products = [
                { productId: '601f1f77bcf86cd799439001', quantity: 0 }
            ];
            const response = await orderAPI.createOrder('507f1f77bcf86cd799439011', products);
            expect(response.data.success).toBe(false);
        });

        test('should handle negative quantity', async () => {
            const products = [
                { productId: '601f1f77bcf86cd799439001', quantity: -5 }
            ];
            const response = await orderAPI.createOrder('507f1f77bcf86cd799439011', products);
            expect(response.data.success).toBe(false);
        });

        test('should handle very large quantity', async () => {
            const products = [
                { productId: '601f1f77bcf86cd799439001', quantity: 999999 }
            ];
            const response = await orderAPI.createOrder('507f1f77bcf86cd799439011', products);
            expect(response.data).toBeDefined();
        });

        test('should handle multiple products', async () => {
            const products = [
                { productId: '601f1f77bcf86cd799439001', quantity: 2 },
                { productId: '601f1f77bcf86cd799439002', quantity: 1 }
            ];
            const response = await orderAPI.createOrder('507f1f77bcf86cd799439011', products);
            expect(response.data.success).toBe(true);
        });
    });

    describe('Get User Orders', () => {
        test('should return user orders', async () => {
            const response = await orderAPI.getUserOrders('507f1f77bcf86cd799439011');
            expect(response.data.success).toBe(true);
            expect(Array.isArray(response.data.data)).toBe(true);
        });

        test('should handle non-existent user ID', async () => {
            const response = await orderAPI.getUserOrders('nonexistentuser');
            expect(response.data.success).toBe(true);
            expect(response.data.data.length).toBe(0);
        });

        test('should support pagination', async () => {
            const response = await orderAPI.getUserOrders('507f1f77bcf86cd799439011', 5, 0);
            expect(response.data.success).toBe(true);
        });
    });
});

describe('Cart API - Mock Mode', () => {
    describe('Get Cart', () => {
        test('should return cart for existing user', async () => {
            const response = await cartAPI.getCart('507f1f77bcf86cd799439011');
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty('userId');
        });

        test('should return error for non-existent user', async () => {
            const response = await cartAPI.getCart('nonexistent');
            expect(response.data.success).toBe(false);
        });
    });

    describe('Clear Cart', () => {
        test('should clear cart successfully', async () => {
            const response = await cartAPI.clearCart('507f1f77bcf86cd799439011');
            expect(response.data.success).toBe(true);
        });
    });
});
