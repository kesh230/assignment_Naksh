const express = require('express');
const { authController, productController, cartController, orderController } = require('./controllers');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

/**
 * ============================================================================
 * AUTH ROUTES
 * ============================================================================
 */
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

/**
 * ============================================================================
 * PRODUCT ROUTES
 * ============================================================================
 */
// Create product
app.post('/api/product', productController.createProduct);

// Get all products with pagination
app.get('/api/product', productController.getAllProducts);

// Search products (MUST come before :productId route)
app.get('/api/product/search', productController.searchProducts);

// Check stock (MUST come before :productId route)
app.get('/api/product/stock/check', productController.checkStock);

// Get products by user (seller's products) (MUST come before :productId route)
app.get('/api/product/user/:userId', productController.getProductsByUser);

// Get product popularity (MUST come before simple :productId route)
app.get('/api/product/:productId/popularity', productController.getProductPopularity);

// Get product by ID (Generic - comes LAST)
app.get('/api/product/:productId', productController.getProductById);

// Update product
app.put('/api/product/:productId', productController.updateProduct);

// Delete product
app.delete('/api/product/:productId', productController.deleteProduct);

/**
 * ============================================================================
 * CART ROUTES
 * ============================================================================
 */
// Get user's cart
app.get('/api/cart/:userId', cartController.getUserCart);

// Get cart items
app.get('/api/cart/:userId/items', cartController.getCartItems);

// Add to cart
app.post('/api/cart/:userId/add', cartController.addToCart);

// Update cart item
app.put('/api/cart/:userId/update', cartController.updateCartItem);

// Remove from cart
app.delete('/api/cart/:userId/remove', cartController.removeFromCart);

// Clear cart
app.delete('/api/cart/:userId/clear', cartController.clearCart);

// Get cart summary
app.get('/api/cart/:userId/summary', cartController.getCartSummary);

/**
 * ============================================================================
 * ORDER ROUTES
 * ============================================================================
 */
// Get all orders (admin) (MUST come before :userId route)
app.get('/api/order', orderController.getAllOrders);

// Get order statistics (MUST come before :userId route)
app.get('/api/order/stats/all', orderController.getOrderStatistics);

// Get seller sales statistics (MUST come before :userId single param route)
app.get('/api/order/sales/:userId/stats', orderController.getSellerSalesStats);

// Get seller sales (specific route)
app.get('/api/order/sales/:userId', orderController.getSellerSales);

// Create order
app.post('/api/order/:userId', orderController.createOrder);

// Get order items (specific route before generic :orderId)
app.get('/api/order/:orderId/items', orderController.getOrderItems);

// Update order status (specific route before generic :orderId)
app.put('/api/order/:orderId/status', orderController.updateOrderStatus);

// Get order details (more specific before generic :userId)
app.get('/api/order/:userId/:orderId', orderController.getOrderDetails);

// Get user orders (generic, comes later)
app.get('/api/order/:userId', orderController.getUserOrders);

/**
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

module.exports = app;