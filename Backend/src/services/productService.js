const { Product, CartItem, OrderItem, User } = require('../models');

class ProductService {
    /**
     * Create new product (1:N relationship - Users creates Products)
     * @param {string} userId
     * @param {string} productName
     * @param {string} description
     * @param {number} price
     * @param {number} quantity
     * @param {string} category
     * @param {string} imageUrl
     * @returns {object} { success, message, data }
     */
    async createProduct(userId, productName, description, price, quantity, category, imageUrl) {
        try {
            const product = new Product({
                name: productName,
                description,
                price,
                quantity,
                category,
                imageUrl,
                userId
            });

            await product.save();

            return {
                success: true,
                message: 'Product created successfully',
                data: {
                    productId: product._id,
                    name: product.name,
                    price: product.price
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get all products
     * @param {number} limit
     * @param {number} offset
     * @returns {array} array of products
     */
    async getAllProducts(limit = 10, offset = 0) {
        try {
            const products = await Product.find()
                .populate('userId', 'username email')
                .limit(limit)
                .skip(offset)
                .sort({ createdAt: -1 });

            return {
                success: true,
                message: 'Products retrieved successfully',
                data: products
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get product by ID
     * @param {string} productId
     * @returns {object} { success, message, data }
     */
    async getProductById(productId) {
        try {
            const product = await Product.findById(productId).populate('userId', 'username email');
            
            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }

            return {
                success: true,
                message: 'Product retrieved successfully',
                data: product
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get all products of a user (1:N relationship - User's products)
     * @param {string} userId
     * @param {number} limit
     * @param {number} offset
     * @returns {object} { success, message, data }
     */
    async getProductsByUser(userId, limit = 10, offset = 0) {
        try {
            const products = await Product.find({ userId })
                .limit(limit)
                .skip(offset)
                .sort({ createdAt: -1 });

            return {
                success: true,
                message: 'User products retrieved successfully',
                data: products
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Search products by name, category, or description
     * @param {string} searchTerm
     * @param {number} limit
     * @param {number} offset
     * @returns {object} { success, message, data }
     */
    async searchProducts(searchTerm, limit = 10, offset = 0) {
        try {
            const products = await Product.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { category: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ]
            })
            .populate('userId', 'username email')
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 });

            return {
                success: true,
                message: 'Search results retrieved successfully',
                data: products
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Update product (owner only)
     * @param {string} productId
     * @param {string} userId
     * @param {object} updates
     * @returns {object} { success, message, data }
     */
    async updateProduct(productId, userId, productName, description, price, quantity, category, imageUrl) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }

            if (product.userId.toString() !== userId) {
                return {
                    success: false,
                    message: 'Not authorized to update this product'
                };
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    name: productName,
                    description,
                    price,
                    quantity,
                    category,
                    imageUrl,
                    updatedAt: Date.now()
                },
                { new: true, runValidators: true }
            );

            return {
                success: true,
                message: 'Product updated successfully',
                data: updatedProduct
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Delete product (owner only)
     * @param {string} productId
     * @param {string} userId
     * @returns {object} { success, message }
     */
    async deleteProduct(productId, userId) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }

            if (product.userId.toString() !== userId) {
                return {
                    success: false,
                    message: 'Not authorized to delete this product'
                };
            }

            await Product.findByIdAndDelete(productId);

            // Clean up cart items and order items with this product
            await CartItem.deleteMany({ productId });
            await OrderItem.deleteMany({ productId });

            return {
                success: true,
                message: 'Product deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get product popularity (1:N relationship - Product in many carts/orders)
     * @param {string} productId
     * @returns {object} { success, message, data }
     */
    async getProductPopularity(productId) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }

            // Count distinct carts containing this product
            const inCarts = await CartItem.distinct('cartId', { productId });

            // Count distinct orders containing this product
            const inOrders = await OrderItem.distinct('orderId', { productId });

            // Total units sold
            const totalSold = await OrderItem.aggregate([
                { $match: { productId: require('mongoose').Types.ObjectId(productId) } },
                { $group: { _id: null, total: { $sum: '$quantity' } } }
            ]);

            return {
                success: true,
                message: 'Product popularity retrieved',
                data: {
                    productId: product._id,
                    productName: product.name,
                    price: product.price,
                    inCarts: inCarts.length,
                    inOrders: inOrders.length,
                    totalSold: totalSold.length > 0 ? totalSold[0].total : 0
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Check stock availability
     * @param {string} productId
     * @param {number} requestedQuantity
     * @returns {object} { success, message }
     */
    async checkStock(productId, requestedQuantity) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }

            if (product.quantity < requestedQuantity) {
                return {
                    success: false,
                    message: `Insufficient stock. Available: ${product.quantity}, Requested: ${requestedQuantity}`
                };
            }

            return {
                success: true,
                message: 'Stock available'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new ProductService();
