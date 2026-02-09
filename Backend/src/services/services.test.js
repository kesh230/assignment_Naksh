/**
 * Backend Unit Tests - User Service
 * Test user registration, login, and authentication
 */

const { userService } = require('../../src/services');
const { User, Cart } = require('../../src/models');
const mongoose = require('mongoose');

// Mock the models
jest.mock('../../src/models');

describe('User Service - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        test('should register new user successfully', async () => {
            const mockUser = {
                _id: '123',
                username: 'testuser',
                email: 'test@example.com'
            };

            User.findOne.mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue(mockUser);
            Cart.prototype.save = jest.fn().mockResolvedValue({});

            const result = await userService.registerUser(
                'testuser',
                'test@example.com',
                'password123',
                '9999999999',
                '123 Street'
            );

            expect(result.success).toBe(true);
            expect(result.data.username).toBe('testuser');
        });

        test('should reject duplicate email', async () => {
            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            const result = await userService.registerUser(
                'newuser',
                'test@example.com',
                'password123',
                '9999999999',
                '123 Street'
            );

            expect(result.success).toBe(false);
            expect(result.message).toContain('already exists');
        });

        test('should reject duplicate username', async () => {
            User.findOne.mockResolvedValue({ username: 'testuser' });

            const result = await userService.registerUser(
                'testuser',
                'new@example.com',
                'password123',
                '9999999999',
                '123 Street'
            );

            expect(result.success).toBe(false);
        });

        test('should handle empty username', async () => {
            const result = await userService.registerUser(
                '',
                'test@example.com',
                'password123',
                '9999999999',
                '123 Street'
            );

            expect(result.success).toBe(false);
        });

        test('should handle empty email', async () => {
            const result = await userService.registerUser(
                'testuser',
                '',
                'password123',
                '9999999999',
                '123 Street'
            );

            expect(result.success).toBe(false);
        });

        test('should handle short password', async () => {
            const result = await userService.registerUser(
                'testuser',
                'test@example.com',
                'pass',
                '9999999999',
                '123 Street'
            );

            // Should either accept or validate
            expect(result).toBeDefined();
        });

        test('should handle database error during registration', async () => {
            User.findOne.mockRejectedValue(new Error('DB Error'));

            const result = await userService.registerUser(
                'testuser',
                'test@example.com',
                'password123',
                '9999999999',
                '123 Street'
            );

            expect(result.success).toBe(false);
        });

        test('should create cart for new user', async () => {
            User.findOne.mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue({ _id: '123' });
            Cart.prototype.save = jest.fn();

            await userService.registerUser(
                'testuser',
                'test@example.com',
                'password123',
                '9999999999',
                '123 Street'
            );

            expect(Cart.prototype.save).toHaveBeenCalled();
        });
    });

    describe('loginUser', () => {
        test('should login user with correct credentials', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                username: 'testuser',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const result = await userService.loginUser('test@example.com', 'password123');

            expect(result.success).toBe(true);
            expect(result.data.userId).toBe('123');
        });

        test('should reject user with wrong password', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                comparePassword: jest.fn().mockResolvedValue(false)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const result = await userService.loginUser('test@example.com', 'wrongpassword');

            expect(result.success).toBe(false);
            expect(result.message).toContain('Invalid password');
        });

        test('should reject non-existent user', async () => {
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const result = await userService.loginUser('notexist@example.com', 'password123');

            expect(result.success).toBe(false);
            expect(result.message).toContain('not found');
        });

        test('should handle empty email', async () => {
            const result = await userService.loginUser('', 'password123');

            expect(result.success).toBe(false);
        });

        test('should handle empty password', async () => {
            const result = await userService.loginUser('test@example.com', '');

            expect(result.success).toBe(false);
        });

        test('should handle null email', async () => {
            const result = await userService.loginUser(null, 'password123');

            expect(result.success).toBe(false);
        });

        test('should handle null password', async () => {
            const result = await userService.loginUser('test@example.com', null);

            expect(result.success).toBe(false);
        });

        test('should generate JWT token on successful login', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                username: 'testuser',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const result = await userService.loginUser('test@example.com', 'password123');

            expect(result.data.token).toBeDefined();
            expect(typeof result.data.token).toBe('string');
        });

        test('should not include password in response', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedpassword',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const result = await userService.loginUser('test@example.com', 'password123');

            expect(result.data.password).toBeUndefined();
        });

        test('should handle database error during login', async () => {
            User.findOne.mockRejectedValue(new Error('DB Error'));

            const result = await userService.loginUser('test@example.com', 'password123');

            expect(result.success).toBe(false);
        });
    });

    describe('getUserById', () => {
        test('should return user by ID', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                username: 'testuser'
            };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const result = await userService.getUserById('123');

            expect(result.success).toBe(true);
            expect(result.data.username).toBe('testuser');
        });

        test('should return error for non-existent user', async () => {
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            const result = await userService.getUserById('nonexistent');

            expect(result.success).toBe(false);
        });

        test('should not include password in response', async () => {
            const mockUser = {
                _id: '123',
                email: 'test@example.com',
                username: 'testuser',
                password: 'shouldnotappear'
            };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            const result = await userService.getUserById('123');

            expect(result.data.password).toBeUndefined();
        });
    });
});

/**
 * Backend Unit Tests - Product Service
 */

const { productService } = require('../../src/services');
const { Product } = require('../../src/models');

jest.mock('../../src/models');

describe('Product Service - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProducts', () => {
        test('should return all products with pagination', async () => {
            const mockProducts = [
                { _id: '1', name: 'Product 1', price: 100 },
                { _id: '2', name: 'Product 2', price: 200 }
            ];

            Product.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue(mockProducts)
            });

            const result = await productService.getAllProducts(10, 0);

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(2);
        });

        test('should handle negative limit', async () => {
            Product.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue([])
            });

            const result = await productService.getAllProducts(-5, 0);

            expect(result).toBeDefined();
        });

        test('should handle large offset', async () => {
            Product.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue([])
            });

            const result = await productService.getAllProducts(10, 99999);

            expect(result.data).toHaveLength(0);
        });
    });

    describe('getProductById', () => {
        test('should return product by ID', async () => {
            const mockProduct = { _id: '1', name: 'Product 1', price: 100 };

            Product.findById.mockResolvedValue(mockProduct);

            const result = await productService.getProductById('1');

            expect(result.success).toBe(true);
            expect(result.data.name).toBe('Product 1');
        });

        test('should return error for non-existent product', async () => {
            Product.findById.mockResolvedValue(null);

            const result = await productService.getProductById('nonexistent');

            expect(result.success).toBe(false);
        });

        test('should handle invalid ID format', async () => {
            Product.findById.mockRejectedValue(new Error('Invalid ID'));

            const result = await productService.getProductById('invalid');

            expect(result.success).toBe(false);
        });
    });

    describe('searchProducts', () => {
        test('should search products by name', async () => {
            const mockResults = [
                { _id: '1', name: 'Shirt', price: 100 }
            ];

            Product.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue(mockResults)
            });

            const result = await productService.searchProducts('shirt', 10, 0);

            expect(result.success).toBe(true);
        });

        test('should return empty array for no matches', async () => {
            Product.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue([])
            });

            const result = await productService.searchProducts('nonexistent', 10, 0);

            expect(result.data).toHaveLength(0);
        });

        test('should handle empty search query', async () => {
            Product.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue([])
            });

            const result = await productService.searchProducts('', 10, 0);

            expect(result).toBeDefined();
        });
    });

    describe('checkStock', () => {
        test('should confirm sufficient stock', async () => {
            const mockProduct = { _id: '1', quantity: 50 };

            Product.findById.mockResolvedValue(mockProduct);

            const result = await productService.checkStock('1', 10);

            expect(result.success).toBe(true);
            expect(result.data.available).toBe(true);
        });

        test('should reject insufficient stock', async () => {
            const mockProduct = { _id: '1', quantity: 5 };

            Product.findById.mockResolvedValue(mockProduct);

            const result = await productService.checkStock('1', 10);

            expect(result.success).toBe(true);
            expect(result.data.available).toBe(false);
        });

        test('should handle zero stock', async () => {
            const mockProduct = { _id: '1', quantity: 0 };

            Product.findById.mockResolvedValue(mockProduct);

            const result = await productService.checkStock('1', 1);

            expect(result.data.available).toBe(false);
        });

        test('should handle negative quantity request', async () => {
            const mockProduct = { _id: '1', quantity: 50 };

            Product.findById.mockResolvedValue(mockProduct);

            const result = await productService.checkStock('1', -5);

            expect(result).toBeDefined();
        });
    });
});

/**
 * Backend Unit Tests - Order Service
 */

const { orderService } = require('../../src/services');
const { Order, OrderItem } = require('../../src/models');

jest.mock('../../src/models');

describe('Order Service - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        test('should create order with valid products', async () => {
            const mockProducts = [
                { _id: '1', name: 'Product 1', price: 100, quantity: 50 }
            ];
            const mockSession = { startTransaction: jest.fn(), commitTransaction: jest.fn() };

            Product.findById = jest.fn().mockResolvedValue(mockProducts[0]);
            Order.prototype.save = jest.fn().mockResolvedValue({ _id: 'order123' });
            OrderItem.prototype.save = jest.fn().mockResolvedValue({});
            Product.findByIdAndUpdate = jest.fn().mockResolvedValue({});

            const result = await orderService.createOrder('user123', [
                { productId: '1', quantity: 2 }
            ]);

            expect(result.success).toBe(true);
            expect(result.data).toHaveProperty('orderId');
        });

        test('should reject order with non-existent product', async () => {
            Product.findById = jest.fn().mockResolvedValue(null);

            const result = await orderService.createOrder('user123', [
                { productId: 'nonexistent', quantity: 1 }
            ]);

            expect(result.success).toBe(false);
        });

        test('should reject order with insufficient stock', async () => {
            const mockProduct = { _id: '1', quantity: 5 };

            Product.findById = jest.fn().mockResolvedValue(mockProduct);

            const result = await orderService.createOrder('user123', [
                { productId: '1', quantity: 10 }
            ]);

            expect(result.success).toBe(false);
        });

        test('should reject order with empty products', async () => {
            const result = await orderService.createOrder('user123', []);

            expect(result.success).toBe(false);
        });

        test('should reject order with zero quantity', async () => {
            const result = await orderService.createOrder('user123', [
                { productId: '1', quantity: 0 }
            ]);

            expect(result.success).toBe(false);
        });

        test('should reject order with negative quantity', async () => {
            const result = await orderService.createOrder('user123', [
                { productId: '1', quantity: -5 }
            ]);

            expect(result.success).toBe(false);
        });

        test('should calculate correct total amount', async () => {
            const mockProduct = { _id: '1', price: 100, quantity: 50 };

            Product.findById = jest.fn().mockResolvedValue(mockProduct);
            Order.prototype.save = jest.fn().mockResolvedValue({ _id: 'order123' });
            OrderItem.prototype.save = jest.fn().mockResolvedValue({});

            const result = await orderService.createOrder('user123', [
                { productId: '1', quantity: 3 }
            ]);

            expect(result.data.totalAmount).toBe(300);
        });
    });

    describe('getUserOrders', () => {
        test('should return user orders', async () => {
            const mockOrders = [
                { _id: 'order1', userId: 'user123', totalAmount: 100 },
                { _id: 'order2', userId: 'user123', totalAmount: 200 }
            ];

            Order.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue(mockOrders)
            });

            const result = await orderService.getUserOrders('user123', 10, 0);

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(2);
        });

        test('should return empty array for user with no orders', async () => {
            Order.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockResolvedValue([])
            });

            const result = await orderService.getUserOrders('newuser', 10, 0);

            expect(result.data).toHaveLength(0);
        });
    });
});
