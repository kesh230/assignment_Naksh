/**
 * ============================================================================
 * COMPLETE API ENDPOINTS DOCUMENTATION WITH JSON
 * ============================================================================
 * 
 * All API endpoints with request/response examples
 * 
 */

/**
 * ============================================================================
 * AUTH ENDPOINTS
 * ============================================================================
 */

/**
 * ENDPOINT: Register User
 * METHOD: POST
 * URL: /api/auth/register
 * DESCRIPTION: Create new user account
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Register User",
    "method": "POST",
    "url": "/api/auth/register",
    "request_body": {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "securePassword123",
        "phone": "1234567890",
        "address": "123 Main Street, New York, NY"
    }
}

/**
 * RESPONSE SUCCESS (201 Created):
 */
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "userId": "507f1f77bcf86cd799439011",
        "username": "john_doe",
        "email": "john@example.com"
    }
}

/**
 * RESPONSE ERROR (400 Bad Request):
 */
{
    "success": false,
    "message": "User already exists with this email or username"
}

/**
 * ============================================================================
 * PRODUCT ENDPOINTS
 * ============================================================================
 */

/**
 * ENDPOINT: Create Product
 * METHOD: POST
 * URL: /api/product
 * DESCRIPTION: Create new product (seller only)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Create Product",
    "method": "POST",
    "url": "/api/product",
    "request_body": {
        "userId": "507f1f77bcf86cd799439011",
        "productName": "iPhone 15 Pro",
        "description": "Latest Apple iPhone with advanced camera",
        "price": 999.99,
        "quantity": 50,
        "category": "Electronics",
        "imageUrl": "https://example.com/iphone15.jpg"
    }
}

/**
 * RESPONSE SUCCESS (201 Created):
 */
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "productId": "607f1f77bcf86cd799439012",
        "name": "iPhone 15 Pro",
        "price": 999.99
    }
}

/**
 * ENDPOINT: Get All Products
 * METHOD: GET
 * URL: /api/product
 * DESCRIPTION: Get all products with pagination
 * QUERY PARAMS: ?limit=10&offset=0
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get All Products",
    "method": "GET",
    "url": "/api/product?limit=10&offset=0",
    "query_params": {
        "limit": 10,
        "offset": 0
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Products retrieved successfully",
    "data": [
        {
            "_id": "607f1f77bcf86cd799439012",
            "name": "iPhone 15 Pro",
            "description": "Latest Apple iPhone with advanced camera",
            "price": 999.99,
            "quantity": 50,
            "category": "Electronics",
            "imageUrl": "https://example.com/iphone15.jpg",
            "userId": {
                "_id": "507f1f77bcf86cd799439011",
                "username": "john_doe",
                "email": "john@example.com"
            },
            "createdAt": "2026-02-09T10:00:00Z",
            "updatedAt": "2026-02-09T10:00:00Z"
        }
    ]
}

/**
 * ENDPOINT: Get Product By ID
 * METHOD: GET
 * URL: /api/product/:productId
 * DESCRIPTION: Get specific product details
 * PARAMS: productId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Product By ID",
    "method": "GET",
    "url": "/api/product/607f1f77bcf86cd799439012",
    "params": {
        "productId": "607f1f77bcf86cd799439012"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Product retrieved successfully",
    "data": {
        "_id": "607f1f77bcf86cd799439012",
        "name": "iPhone 15 Pro",
        "description": "Latest Apple iPhone",
        "price": 999.99,
        "quantity": 50,
        "category": "Electronics",
        "userId": {
            "_id": "507f1f77bcf86cd799439011",
            "username": "john_doe"
        }
    }
}

/**
 * ENDPOINT: Get Products By User
 * METHOD: GET
 * URL: /api/product/user/:userId
 * DESCRIPTION: Get all products created by specific seller (1:N relationship)
 * PARAMS: userId (MongoDB ObjectId)
 * QUERY PARAMS: ?limit=10&offset=0
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Products By User",
    "method": "GET",
    "url": "/api/product/user/507f1f77bcf86cd799439011?limit=10&offset=0",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "User products retrieved successfully",
    "data": [
        {
            "_id": "607f1f77bcf86cd799439012",
            "name": "iPhone 15 Pro",
            "price": 999.99,
            "quantity": 50
        },
        {
            "_id": "607f1f77bcf86cd799439013",
            "name": "MacBook Pro",
            "price": 1999.99,
            "quantity": 20
        }
    ]
}

/**
 * ENDPOINT: Search Products
 * METHOD: GET
 * URL: /api/product/search
 * DESCRIPTION: Search products by name, description, category
 * QUERY PARAMS: ?query=iPhone&limit=10&offset=0
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Search Products",
    "method": "GET",
    "url": "/api/product/search?query=iPhone&limit=10&offset=0",
    "query_params": {
        "query": "iPhone",
        "limit": 10,
        "offset": 0
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Search results retrieved successfully",
    "data": [
        {
            "_id": "607f1f77bcf86cd799439012",
            "name": "iPhone 15 Pro",
            "description": "Latest Apple iPhone",
            "price": 999.99
        }
    ]
}

/**
 * ENDPOINT: Update Product
 * METHOD: PUT
 * URL: /api/product/:productId
 * DESCRIPTION: Update product details (owner only)
 * PARAMS: productId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Update Product",
    "method": "PUT",
    "url": "/api/product/607f1f77bcf86cd799439012",
    "params": {
        "productId": "607f1f77bcf86cd799439012"
    },
    "request_body": {
        "userId": "507f1f77bcf86cd799439011",
        "productName": "iPhone 15 Pro Max",
        "description": "Latest Apple iPhone Pro Max",
        "price": 1099.99,
        "quantity": 30,
        "category": "Electronics"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Product updated successfully",
    "data": {
        "_id": "607f1f77bcf86cd799439012",
        "name": "iPhone 15 Pro Max",
        "price": 1099.99
    }
}

/**
 * ENDPOINT: Delete Product
 * METHOD: DELETE
 * URL: /api/product/:productId
 * DESCRIPTION: Delete product (owner only)
 * PARAMS: productId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Delete Product",
    "method": "DELETE",
    "url": "/api/product/607f1f77bcf86cd799439012",
    "params": {
        "productId": "607f1f77bcf86cd799439012"
    },
    "request_body": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Product deleted successfully"
}

/**
 * ENDPOINT: Get Product Popularity
 * METHOD: GET
 * URL: /api/product/:productId/popularity
 * DESCRIPTION: Show how many carts/orders contain this product (1:N relationship)
 * PARAMS: productId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Product Popularity",
    "method": "GET",
    "url": "/api/product/607f1f77bcf86cd799439012/popularity",
    "params": {
        "productId": "607f1f77bcf86cd799439012"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Product popularity retrieved",
    "data": {
        "productId": "607f1f77bcf86cd799439012",
        "productName": "iPhone 15 Pro",
        "price": 999.99,
        "inCarts": 45,
        "inOrders": 120,
        "totalSold": 500
    }
}

/**
 * ENDPOINT: Check Stock
 * METHOD: GET
 * URL: /api/product/stock/check
 * DESCRIPTION: Check if product is in stock
 * QUERY PARAMS: ?productId=xxx&quantity=5
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Check Stock",
    "method": "GET",
    "url": "/api/product/stock/check?productId=607f1f77bcf86cd799439012&quantity=5",
    "query_params": {
        "productId": "607f1f77bcf86cd799439012",
        "quantity": 5
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Stock available"
}

/**
 * RESPONSE ERROR (400):
 */
{
    "success": false,
    "message": "Insufficient stock. Available: 2, Requested: 5"
}

/**
 * ============================================================================
 * CART ENDPOINTS
 * ============================================================================
 */

/**
 * ENDPOINT: Get User Cart
 * METHOD: GET
 * URL: /api/cart/:userId
 * DESCRIPTION: Get user's cart (1:1 relationship)
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get User Cart",
    "method": "GET",
    "url": "/api/cart/507f1f77bcf86cd799439011",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Cart retrieved successfully",
    "data": {
        "_id": "707f1f77bcf86cd799439021",
        "userId": "507f1f77bcf86cd799439011",
        "totalAmount": 2999.97,
        "createdAt": "2026-02-08T10:00:00Z",
        "updatedAt": "2026-02-09T15:30:00Z"
    }
}

/**
 * ENDPOINT: Get Cart Items
 * METHOD: GET
 * URL: /api/cart/:userId/items
 * DESCRIPTION: Get all items in user's cart (1:N relationship)
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Cart Items",
    "method": "GET",
    "url": "/api/cart/507f1f77bcf86cd799439011/items",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Cart items retrieved successfully",
    "data": [
        {
            "_id": "807f1f77bcf86cd799439031",
            "cartId": "707f1f77bcf86cd799439021",
            "productId": {
                "_id": "607f1f77bcf86cd799439012",
                "name": "iPhone 15 Pro",
                "price": 999.99,
                "imageUrl": "https://example.com/iphone15.jpg",
                "category": "Electronics",
                "userId": {
                    "_id": "507f1f77bcf86cd799439011",
                    "username": "john_doe",
                    "email": "john@example.com"
                }
            },
            "quantity": 2,
            "unitPrice": 999.99,
            "addedAt": "2026-02-09T10:00:00Z"
        }
    ]
}

/**
 * ENDPOINT: Add To Cart
 * METHOD: POST
 * URL: /api/cart/:userId/add
 * DESCRIPTION: Add product to cart (shows 1:N - product in many carts)
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Add To Cart",
    "method": "POST",
    "url": "/api/cart/507f1f77bcf86cd799439011/add",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    },
    "request_body": {
        "productId": "607f1f77bcf86cd799439012",
        "quantity": 2
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Product added to cart"
}

/**
 * ENDPOINT: Update Cart Item
 * METHOD: PUT
 * URL: /api/cart/:userId/update
 * DESCRIPTION: Update item quantity in cart
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Update Cart Item",
    "method": "PUT",
    "url": "/api/cart/507f1f77bcf86cd799439011/update",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    },
    "request_body": {
        "cartItemId": "807f1f77bcf86cd799439031",
        "quantity": 5
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Cart item updated"
}

/**
 * ENDPOINT: Remove From Cart
 * METHOD: DELETE
 * URL: /api/cart/:userId/remove
 * DESCRIPTION: Remove item from cart
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Remove From Cart",
    "method": "DELETE",
    "url": "/api/cart/507f1f77bcf86cd799439011/remove",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    },
    "request_body": {
        "cartItemId": "807f1f77bcf86cd799439031"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Item removed from cart"
}

/**
 * ENDPOINT: Clear Cart
 * METHOD: DELETE
 * URL: /api/cart/:userId/clear
 * DESCRIPTION: Clear all items from cart
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Clear Cart",
    "method": "DELETE",
    "url": "/api/cart/507f1f77bcf86cd799439011/clear",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Cart cleared"
}

/**
 * ENDPOINT: Get Cart Summary
 * METHOD: GET
 * URL: /api/cart/:userId/summary
 * DESCRIPTION: Get cart totals (items, quantity, amount)
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Cart Summary",
    "method": "GET",
    "url": "/api/cart/507f1f77bcf86cd799439011/summary",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Cart summary retrieved",
    "data": {
        "totalItems": 3,
        "totalQuantity": 10,
        "totalAmount": 4999.95
    }
}

/**
 * ============================================================================
 * ORDER ENDPOINTS
 * ============================================================================
 */

/**
 * ENDPOINT: Create Order
 * METHOD: POST
 * URL: /api/order/:userId
 * DESCRIPTION: Create order directly with products (1:N relationship, transaction support)
 * DESCRIPTION: NO dependency on cart - user specifies products directly
 * PARAMS: userId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Create Order",
    "method": "POST",
    "url": "/api/order/507f1f77bcf86cd799439011",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    },
    "request_body": {
        "products": [
            {
                "productId": "607f1f77bcf86cd799439012",
                "quantity": 2
            },
            {
                "productId": "607f1f77bcf86cd799439013",
                "quantity": 1
            }
        ]
    }
}

/**
 * RESPONSE SUCCESS (201 Created):
 */
{
    "success": true,
    "message": "Order placed successfully",
    "data": {
        "orderId": "907f1f77bcf86cd799439041",
        "totalAmount": 4999.95
    }
}

/**
 * ENDPOINT: Get User Orders
 * METHOD: GET
 * URL: /api/order/:userId
 * DESCRIPTION: Get all orders placed by user (1:N relationship)
 * PARAMS: userId (MongoDB ObjectId)
 * QUERY PARAMS: ?limit=10&offset=0
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get User Orders",
    "method": "GET",
    "url": "/api/order/507f1f77bcf86cd799439011?limit=10&offset=0",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Orders retrieved successfully",
    "data": [
        {
            "_id": "907f1f77bcf86cd799439041",
            "userId": "507f1f77bcf86cd799439011",
            "totalAmount": 4999.95,
            "status": "pending",
            "createdAt": "2026-02-09T10:00:00Z",
            "updatedAt": "2026-02-09T10:00:00Z"
        }
    ]
}

/**
 * ENDPOINT: Get Order Details
 * METHOD: GET
 * URL: /api/order/:userId/:orderId
 * DESCRIPTION: Get order with all items (1:N relationship)
 * PARAMS: userId, orderId (MongoDB ObjectIds)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Order Details",
    "method": "GET",
    "url": "/api/order/507f1f77bcf86cd799439011/907f1f77bcf86cd799439041",
    "params": {
        "userId": "507f1f77bcf86cd799439011",
        "orderId": "907f1f77bcf86cd799439041"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Order details retrieved successfully",
    "data": {
        "_id": "907f1f77bcf86cd799439041",
        "userId": "507f1f77bcf86cd799439011",
        "totalAmount": 4999.95,
        "status": "pending",
        "createdAt": "2026-02-09T10:00:00Z",
        "items": [
            {
                "_id": "1007f1f77bcf86cd799439051",
                "orderId": "907f1f77bcf86cd799439041",
                "productId": {
                    "_id": "607f1f77bcf86cd799439012",
                    "name": "iPhone 15 Pro",
                    "imageUrl": "https://example.com/iphone15.jpg",
                    "category": "Electronics",
                    "userId": {
                        "_id": "507f1f77bcf86cd799439011",
                        "username": "john_doe"
                    }
                },
                "quantity": 2,
                "unitPrice": 999.99,
                "subtotal": 1999.98
            }
        ]
    }
}

/**
 * ENDPOINT: Get All Orders (Admin)
 * METHOD: GET
 * URL: /api/order
 * DESCRIPTION: Get all orders in system
 * QUERY PARAMS: ?limit=10&offset=0
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get All Orders (Admin)",
    "method": "GET",
    "url": "/api/order?limit=10&offset=0",
    "query_params": {
        "limit": 10,
        "offset": 0
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "All orders retrieved successfully",
    "data": [
        {
            "_id": "907f1f77bcf86cd799439041",
            "userId": {
                "_id": "507f1f77bcf86cd799439011",
                "username": "john_doe",
                "email": "john@example.com"
            },
            "totalAmount": 4999.95,
            "status": "pending",
            "createdAt": "2026-02-09T10:00:00Z"
        }
    ]
}

/**
 * ENDPOINT: Update Order Status
 * METHOD: PUT
 * URL: /api/order/:orderId/status
 * DESCRIPTION: Update order status (pending → confirmed → shipped → delivered)
 * PARAMS: orderId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Update Order Status",
    "method": "PUT",
    "url": "/api/order/907f1f77bcf86cd799439041/status",
    "params": {
        "orderId": "907f1f77bcf86cd799439041"
    },
    "request_body": {
        "status": "confirmed"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Order status updated successfully"
}

/**
 * ENDPOINT: Get Order Statistics
 * METHOD: GET
 * URL: /api/order/stats/all
 * DESCRIPTION: Get order statistics (total, spent, average)
 * QUERY PARAMS: ?userId=xxx (optional - for specific user)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Order Statistics",
    "method": "GET",
    "url": "/api/order/stats/all?userId=507f1f77bcf86cd799439011",
    "query_params": {
        "userId": "507f1f77bcf86cd799439011 (optional)"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Order statistics retrieved successfully",
    "data": {
        "totalOrders": 5,
        "totalSpent": 24999.75,
        "averageOrderValue": 4999.95,
        "completedOrders": 3,
        "pendingOrders": 1,
        "cancelledOrders": 1
    }
}

/**
 * ENDPOINT: Get Order Items
 * METHOD: GET
 * URL: /api/order/:orderId/items
 * DESCRIPTION: Get all items in specific order
 * PARAMS: orderId (MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Order Items",
    "method": "GET",
    "url": "/api/order/907f1f77bcf86cd799439041/items",
    "params": {
        "orderId": "907f1f77bcf86cd799439041"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Order items retrieved successfully",
    "data": [
        {
            "_id": "1007f1f77bcf86cd799439051",
            "orderId": "907f1f77bcf86cd799439041",
            "productId": {
                "_id": "607f1f77bcf86cd799439012",
                "name": "iPhone 15 Pro",
                "imageUrl": "https://example.com/iphone15.jpg",
                "category": "Electronics"
            },
            "quantity": 2,
            "unitPrice": 999.99,
            "subtotal": 1999.98
        }
    ]
}

/**
 * ENDPOINT: Get Seller Sales
 * METHOD: GET
 * URL: /api/order/sales/:userId
 * DESCRIPTION: Get seller's product sales (1:N relationship)
 * PARAMS: userId (seller's MongoDB ObjectId)
 * QUERY PARAMS: ?limit=10&offset=0
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Seller Sales",
    "method": "GET",
    "url": "/api/order/sales/507f1f77bcf86cd799439011?limit=10&offset=0",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Seller sales retrieved successfully",
    "data": [
        {
            "orderItemId": "1007f1f77bcf86cd799439051",
            "productId": "607f1f77bcf86cd799439012",
            "productName": "iPhone 15 Pro",
            "quantity": 2,
            "unitPrice": 999.99,
            "subtotal": 1999.98,
            "orderDate": "2026-02-09T10:00:00Z",
            "orderStatus": "pending",
            "buyerId": "507f1f77bcf86cd799439011"
        }
    ]
}

/**
 * ENDPOINT: Get Seller Sales Statistics
 * METHOD: GET
 * URL: /api/order/sales/:userId/stats
 * DESCRIPTION: Get seller sales statistics
 * PARAMS: userId (seller's MongoDB ObjectId)
 * 
 * REQUEST:
 */
{
    "endpoint_name": "Get Seller Sales Statistics",
    "method": "GET",
    "url": "/api/order/sales/507f1f77bcf86cd799439011/stats",
    "params": {
        "userId": "507f1f77bcf86cd799439011"
    }
}

/**
 * RESPONSE SUCCESS (200 OK):
 */
{
    "success": true,
    "message": "Seller sales statistics retrieved successfully",
    "data": {
        "totalSold": 50,
        "totalQuantity": 150,
        "totalRevenue": 149999.50,
        "averageSaleValue": 2999.99
    }
}

/**
 * ============================================================================
 * 📊 COMPLETE ENDPOINT SUMMARY TABLE
 * ============================================================================
 */

/**
 * AUTH - 1 Endpoint
 * ├─ POST   /api/auth/register                          - Register User
 * 
 * PRODUCTS - 9 Endpoints
 * ├─ POST   /api/product                                - Create Product
 * ├─ GET    /api/product                                - Get All Products
 * ├─ GET    /api/product/:productId                     - Get Product By ID
 * ├─ GET    /api/product/user/:userId                   - Get Products By User (1:N)
 * ├─ GET    /api/product/search                         - Search Products
 * ├─ PUT    /api/product/:productId                     - Update Product
 * ├─ DELETE /api/product/:productId                     - Delete Product
 * ├─ GET    /api/product/:productId/popularity          - Get Product Popularity (1:N)
 * └─ GET    /api/product/stock/check                    - Check Stock
 * 
 * CART - 7 Endpoints
 * ├─ GET    /api/cart/:userId                           - Get User Cart (1:1)
 * ├─ GET    /api/cart/:userId/items                     - Get Cart Items (1:N)
 * ├─ POST   /api/cart/:userId/add                       - Add To Cart (1:N Product)
 * ├─ PUT    /api/cart/:userId/update                    - Update Cart Item
 * ├─ DELETE /api/cart/:userId/remove                    - Remove From Cart
 * ├─ DELETE /api/cart/:userId/clear                     - Clear Cart
 * └─ GET    /api/cart/:userId/summary                   - Get Cart Summary
 * 
 * ORDERS - 9 Endpoints
 * ├─ POST   /api/order/:userId                          - Create Order (1:N)
 * ├─ GET    /api/order/:userId                          - Get User Orders (1:N)
 * ├─ GET    /api/order/:userId/:orderId                 - Get Order Details (1:N)
 * ├─ GET    /api/order                                  - Get All Orders (Admin)
 * ├─ PUT    /api/order/:orderId/status                  - Update Order Status
 * ├─ GET    /api/order/stats/all                        - Get Order Statistics
 * ├─ GET    /api/order/:orderId/items                   - Get Order Items (1:N)
 * ├─ GET    /api/order/sales/:userId                    - Get Seller Sales (1:N)
 * └─ GET    /api/order/sales/:userId/stats              - Get Seller Sales Statistics
 * 
 * TOTAL: 26 Endpoints
 * 
 * HTTP Methods:
 * ├─ GET (11)  - Retrieve data
 * ├─ POST (4)  - Create data
 * ├─ PUT (2)   - Update data
 * └─ DELETE (3) - Delete data
 */

/**
 * ============================================================================
 * 🔄 DATABASE RELATIONSHIPS IN ENDPOINTS
 * ============================================================================
 */

/**
 * 1. Users (1:N) Products
 *    └─ GET /api/product/user/:userId - Get seller's products
 * 
 * 2. Users (1:1) Cart
 *    └─ GET /api/cart/:userId - Get user's single cart
 * 
 * 3. Cart (1:N) CartItems
 *    └─ GET /api/cart/:userId/items - Get multiple items in cart
 * 
 * 4. Products (1:N) CartItems [KEY RELATIONSHIP]
 *    └─ GET /api/product/:productId/popularity - Show product in many carts
 *    └─ POST /api/cart/:userId/add - Product added to cart
 * 
 * 5. Users (1:N) Orders
 *    └─ GET /api/order/:userId - Get user's multiple orders
 *    └─ POST /api/order/:userId - Create order for user
 * 
 * 6. Orders (1:N) OrderItems
 *    └─ GET /api/order/:orderId/items - Get multiple items in order
 */

/**
 * ============================================================================
 * READY FOR TESTING WITH POSTMAN
 * ============================================================================
 */
