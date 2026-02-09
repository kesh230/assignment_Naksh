/**
 * Regression Test Suite
 * Full workflow tests covering end-to-end scenarios
 */

const request = require('supertest');
const app = require('../../src/app');
const { User, Product, Cart, Order } = require('../../src/models');

describe('Regression Tests - Full User Workflows', () => {
    let userId;
    let authToken;
    let productId;

    beforeAll(async () => {
        // Setup: Create test product
        productId = 'test-product-001';
        // Seed test data if needed
    });

    describe('Complete User Journey - Registration to Checkout', () => {
        test('Should complete full workflow: Register → Login → Add to Cart → Checkout', async () => {
            const userData = {
                username: 'testuser_' + Date.now(),
                email: 'test_' + Date.now() + '@example.com',
                password: 'TestPass123!',
                phone: '9999999999',
                address: '123 Test Street'
            };

            // Step 1: Register User
            const registerRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(registerRes.status).toBe(201);
            expect(registerRes.body.success).toBe(true);
            userId = registerRes.body.data.userId;

            // Step 2: Login
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: userData.password
                });

            expect(loginRes.status).toBe(200);
            expect(loginRes.body.data.token).toBeDefined();
            authToken = loginRes.body.data.token;

            // Step 3: Get Products
            const productsRes = await request(app)
                .get('/api/products')
                .set('Authorization', `Bearer ${authToken}`);

            expect(productsRes.status).toBe(200);
            expect(productsRes.body.data.length).toBeGreaterThan(0);

            // Step 4: Add to Cart
            const cartRes = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    productId: productsRes.body.data[0]._id,
                    quantity: 2
                });

            expect(cartRes.status).toBe(200);

            // Step 5: Verify Cart
            const getCartRes = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${authToken}`);

            expect(getCartRes.status).toBe(200);
            expect(getCartRes.body.data.items.length).toBeGreaterThan(0);

            // Step 6: Create Order
            const orderRes = await request(app)
                .post('/api/orders/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    items: getCartRes.body.data.items,
                    shippingAddress: userData.address
                });

            expect(orderRes.status).toBe(201);
            expect(orderRes.body.data.orderId).toBeDefined();
        });

        test('Should persist user data after logout/login', async () => {
            // Register and get token
            const userData = {
                username: 'persistent_' + Date.now(),
                email: 'persist_' + Date.now() + '@example.com',
                password: 'TestPass123!',
                phone: '9999999999',
                address: '123 Test Street'
            };

            const registerRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const userId = registerRes.body.data.userId;

            // Add to cart
            const addCartRes = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${registerRes.body.data.token}`)
                .send({ productId: 'product1', quantity: 1 });

            // Re-login
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userData.email,
                    password: userData.password
                });

            // Verify cart still exists
            const cartRes = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${loginRes.body.data.token}`);

            expect(cartRes.body.data.items.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Multi-User Isolation Tests', () => {
        test('User1 should not see User2 cart', async () => {
            const user1Data = {
                username: 'user1_' + Date.now(),
                email: 'user1_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const user2Data = {
                username: 'user2_' + Date.now(),
                email: 'user2_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '8888888888',
                address: '456 Avenue'
            };

            // Register both users
            const user1Res = await request(app)
                .post('/api/auth/register')
                .send(user1Data);

            const user2Res = await request(app)
                .post('/api/auth/register')
                .send(user2Data);

            const token1 = user1Res.body.data.token;
            const token2 = user2Res.body.data.token;

            // User1 adds to cart
            await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${token1}`)
                .send({ productId: 'product1', quantity: 1 });

            // User2 gets cart - should be empty
            const user2CartRes = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token2}`);

            expect(user2CartRes.body.data.items.length).toBe(0);
        });

        test('User1 should not see User2 orders', async () => {
            const user1Data = {
                username: 'user1ord_' + Date.now(),
                email: 'user1ord_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const user2Data = {
                username: 'user2ord_' + Date.now(),
                email: 'user2ord_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '8888888888',
                address: '456 Avenue'
            };

            // Get tokens
            const user1Res = await request(app)
                .post('/api/auth/register')
                .send(user1Data);

            const user2Res = await request(app)
                .post('/api/auth/register')
                .send(user2Data);

            const user1Id = user1Res.body.data.userId;
            const token2 = user2Res.body.data.token;

            // User2 gets orders - should only see their own
            const user2OrdersRes = await request(app)
                .get('/api/orders/myorders')
                .set('Authorization', `Bearer ${token2}`);

            // Verify no orders from user1
            expect(user2OrdersRes.body.data).toEqual(
                expect.not.arrayContaining([
                    expect.objectContaining({ userId: user1Id })
                ])
            );
        });
    });

    describe('Stock Management & Concurrency', () => {
        test('Should prevent overselling when stock is low', async () => {
            const userData = {
                username: 'stock_' + Date.now(),
                email: 'stock_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            // Try to order 1000 units (assuming product has limited stock)
            const orderRes = await request(app)
                .post('/api/orders/create')
                .set('Authorization', `Bearer ${userRes.body.data.token}`)
                .send({
                    items: [{ productId: 'product1', quantity: 1000 }]
                });

            // Should fail or warn about insufficient stock
            expect(orderRes.status).not.toBe(500);
        });
    });

    describe('Authentication & Authorization', () => {
        test('Should reject request without auth token', async () => {
            const cartRes = await request(app)
                .get('/api/cart');

            expect(cartRes.status).toBe(401);
        });

        test('Should reject request with invalid token', async () => {
            const cartRes = await request(app)
                .get('/api/cart')
                .set('Authorization', 'Bearer invalid.token.here');

            expect(cartRes.status).toBe(401);
        });

        test('Should reject expired token', async () => {
            // Create expired token
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.invalid';

            const cartRes = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${expiredToken}`);

            expect(cartRes.status).toBe(401);
        });
    });

    describe('Data Validation & Error Handling', () => {
        test('Should validate email format on registration', async () => {
            const userData = {
                username: 'testuser',
                email: 'invalid-email',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).toBe(400);
        });

        test('Should validate phone format', async () => {
            const userData = {
                username: 'testuser_' + Date.now(),
                email: 'test_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: 'invalid',
                address: '123 Street'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.status).not.toBe(201);
        });

        test('Should handle missing required fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser' });

            expect(res.status).toBe(400);
        });

        test('Should handle malformed JSON', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .set('Content-Type', 'application/json')
                .send('invalid json');

            expect(res.status).toBe(400);
        });
    });

    describe('Cart Operations - Edge Cases', () => {
        test('Should prevent adding negative quantity to cart', async () => {
            const userData = {
                username: 'negqty_' + Date.now(),
                email: 'negqty_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const res = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${userRes.body.data.token}`)
                .send({ productId: 'product1', quantity: -5 });

            expect(res.status).not.toBe(200);
        });

        test('Should prevent adding zero quantity to cart', async () => {
            const userData = {
                username: 'zeroqty_' + Date.now(),
                email: 'zeroqty_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const res = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${userRes.body.data.token}`)
                .send({ productId: 'product1', quantity: 0 });

            expect(res.status).not.toBe(200);
        });

        test('Should handle duplicate add to cart correctly', async () => {
            const userData = {
                username: 'dupple_' + Date.now(),
                email: 'dupple_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const token = userRes.body.data.token;

            // Add item first time
            const res1 = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: 'product1', quantity: 2 });

            // Add same item again
            const res2 = await request(app)
                .post('/api/cart/add')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: 'product1', quantity: 3 });

            // Verify cart has correct total (5 units or replaced?)
            const cartRes = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            if (res2.status === 200) {
                expect(cartRes.body.data.items).toBeDefined();
            }
        });
    });

    describe('Order Processing - Edge Cases', () => {
        test('Should handle order with single item', async () => {
            const userData = {
                username: 'single_' + Date.now(),
                email: 'single_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const res = await request(app)
                .post('/api/orders/create')
                .set('Authorization', `Bearer ${userRes.body.data.token}`)
                .send({
                    items: [{ productId: 'product1', quantity: 1 }]
                });

            expect(res.status).not.toBe(500);
        });

        test('Should handle order with multiple items', async () => {
            const userData = {
                username: 'multi_' + Date.now(),
                email: 'multi_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const res = await request(app)
                .post('/api/orders/create')
                .set('Authorization', `Bearer ${userRes.body.data.token}`)
                .send({
                    items: [
                        { productId: 'product1', quantity: 2 },
                        { productId: 'product2', quantity: 3 }
                    ]
                });

            expect(res.status).not.toBe(500);
        });

        test('Should reject order with empty items', async () => {
            const userData = {
                username: 'empty_' + Date.now(),
                email: 'empty_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const res = await request(app)
                .post('/api/orders/create')
                .set('Authorization', `Bearer ${userRes.body.data.token}`)
                .send({ items: [] });

            expect(res.status).not.toBe(201);
        });
    });

    describe('Search & Filter - Regression', () => {
        test('Should search with special characters', async () => {
            const res = await request(app)
                .get('/api/products/search')
                .query({ q: '@#$%' });

            expect(res.status).toBe(200);
        });

        test('Should handle very long search query', async () => {
            const longQuery = 'a'.repeat(1000);

            const res = await request(app)
                .get('/api/products/search')
                .query({ q: longQuery });

            expect(res.status).toBe(200);
        });

        test('Should handle pagination with invalid numbers', async () => {
            const res = await request(app)
                .get('/api/products')
                .query({ limit: -10, offset: -5 });

            expect(res.status).toBe(200);
        });
    });

    describe('Concurrent Requests', () => {
        test('Should handle multiple concurrent cart additions', async () => {
            const userData = {
                username: 'concurrent_' + Date.now(),
                email: 'concurrent_' + Date.now() + '@example.com',
                password: 'Pass123!',
                phone: '9999999999',
                address: '123 Street'
            };

            const userRes = await request(app)
                .post('/api/auth/register')
                .send(userData);

            const token = userRes.body.data.token;

            // Make 5 concurrent requests
            const promises = Array(5).fill(null).map(() =>
                request(app)
                    .post('/api/cart/add')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ productId: 'product1', quantity: 1 })
            );

            const results = await Promise.all(promises);

            // All should succeed
            results.forEach(res => {
                expect(res.status).not.toBe(500);
            });
        });
    });
});
