const { Order, OrderItem, Cart, CartItem, Product } = require('../models');
const mongoose = require('mongoose');

class OrderService {
    /**
     * Create order directly with products (1:N relationship - User places many Orders)
     * No dependency on cart - user specifies products directly
     * MongoDB transaction support
     * @param {string} userId
     * @param {array} products - Array of {productId, quantity}
     * @returns {object} { success, message, data }
     */
    async createOrder(userId, products) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Validate and get all products with stock checking
            let totalAmount = 0;
            const orderItems = [];

            for (const item of products) {
                const product = await Product.findById(item.productId).session(session);

                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`);
                }

                if (product.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
                }

                const subtotal = product.price * item.quantity;
                totalAmount += subtotal;

                orderItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    subtotal
                });
            }

            // Create order
            const order = new Order({
                userId,
                totalAmount,
                status: 'pending'
            });

            await order.save({ session });

            // Insert order items and update product stock
            for (let i = 0; i < orderItems.length; i++) {
                const item = orderItems[i];

                // Create order item
                const orderItem = new OrderItem({
                    orderId: order._id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal
                });

                await orderItem.save({ session });

                // Reduce product stock
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { quantity: -item.quantity } },
                    { session }
                );
            }

            await session.commitTransaction();

            return {
                success: true,
                message: 'Order placed successfully',
                data: {
                    orderId: order._id,
                    totalAmount: totalAmount,
                    itemCount: products.length
                }
            };
        } catch (error) {
            await session.abortTransaction();
            return {
                success: false,
                message: error.message
            };
        } finally {
            session.endSession();
        }
    }

    /**
     * Get all orders of user (1:N relationship - User has many Orders)
     * @param {string} userId
     * @param {number} limit
     * @param {number} offset
     * @returns {object} { success, message, data }
     */
    async getUserOrders(userId, limit = 10, offset = 0) {
        try {
            const orders = await Order.find({ userId })
                .limit(limit)
                .skip(offset)
                .sort({ createdAt: -1 });

            return {
                success: true,
                message: 'Orders retrieved successfully',
                data: orders
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get order details with items (1:N relationship - Order has many Order_Items)
     * @param {string} orderId
     * @param {string} userId
     * @returns {object} { success, message, data }
     */
    async getOrderDetails(orderId, userId) {
        try {
            const order = await Order.findById(orderId);

            if (!order || order.userId.toString() !== userId) {
                return {
                    success: false,
                    message: 'Order not found'
                };
            }

            // Get order items
            const items = await OrderItem.find({ orderId })
                .populate({
                    path: 'productId',
                    select: 'name imageUrl category userId'
                })
                .populate({
                    path: 'productId',
                    populate: {
                        path: 'userId',
                        select: 'username email'
                    }
                });

            return {
                success: true,
                message: 'Order details retrieved successfully',
                data: {
                    ...order.toObject(),
                    items: items
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
     * Get all orders (Admin only)
     * @param {number} limit
     * @param {number} offset
     * @returns {object} { success, message, data }
     */
    async getAllOrders(limit = 10, offset = 0) {
        try {
            const orders = await Order.find()
                .populate('userId', 'username email')
                .limit(limit)
                .skip(offset)
                .sort({ createdAt: -1 });

            return {
                success: true,
                message: 'All orders retrieved successfully',
                data: orders
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Update order status
     * @param {string} orderId
     * @param {string} status
     * @returns {object} { success, message }
     */
    async updateOrderStatus(orderId, status) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

            if (!validStatuses.includes(status)) {
                return {
                    success: false,
                    message: 'Invalid status'
                };
            }

            // If cancelling order, restore product stock
            if (status === 'cancelled') {
                const orderItems = await OrderItem.find({ orderId }).session(session);

                for (const item of orderItems) {
                    await Product.findByIdAndUpdate(
                        item.productId,
                        { $inc: { quantity: item.quantity } },
                        { session }
                    );
                }
            }

            const order = await Order.findByIdAndUpdate(
                orderId,
                {
                    status,
                    updatedAt: Date.now()
                },
                { session, new: true }
            );

            await session.commitTransaction();

            return {
                success: true,
                message: 'Order status updated successfully'
            };
        } catch (error) {
            await session.abortTransaction();
            return {
                success: false,
                message: error.message
            };
        } finally {
            session.endSession();
        }
    }

    /**
     * Get order statistics
     * @param {string} userId (optional)
     * @returns {object} { success, message, data }
     */
    async getOrderStatistics(userId = null) {
        try {
            let match = {};
            if (userId) {
                match.userId = mongoose.Types.ObjectId(userId);
            }

            const stats = await Order.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalSpent: { $sum: '$totalAmount' },
                        averageOrderValue: { $avg: '$totalAmount' },
                        completedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                        },
                        pendingOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                        },
                        cancelledOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                        }
                    }
                }
            ]);

            return {
                success: true,
                message: 'Order statistics retrieved successfully',
                data: stats.length > 0 ? stats[0] : {}
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get order items for an order
     * @param {string} orderId
     * @returns {object} { success, message, data }
     */
    async getOrderItems(orderId) {
        try {
            const items = await OrderItem.find({ orderId })
                .populate('productId', 'name imageUrl category');

            return {
                success: true,
                message: 'Order items retrieved successfully',
                data: items
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get seller's sales (products sold) (1:N relationship)
     * @param {string} userId
     * @param {number} limit
     * @param {number} offset
     * @returns {object} { success, message, data }
     */
    async getSellerSales(userId, limit = 10, offset = 0) {
        try {
            const sales = await OrderItem.aggregate([
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'order'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                { $unwind: '$order' },
                { $unwind: '$product' },
                { $match: { 'product.userId': mongoose.Types.ObjectId(userId) } },
                { $sort: { 'order.createdAt': -1 } },
                { $skip: offset },
                { $limit: limit },
                {
                    $project: {
                        orderItemId: '$_id',
                        productId: '$productId',
                        productName: '$product.name',
                        quantity: '$quantity',
                        unitPrice: '$unitPrice',
                        subtotal: '$subtotal',
                        orderDate: '$order.createdAt',
                        orderStatus: '$order.status',
                        buyerId: '$order.userId'
                    }
                }
            ]);

            return {
                success: true,
                message: 'Seller sales retrieved successfully',
                data: sales
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get seller sales statistics
     * @param {string} userId
     * @returns {object} { success, message, data }
     */
    async getSellerSalesStats(userId) {
        try {
            const stats = await OrderItem.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                { $unwind: '$product' },
                { $match: { 'product.userId': mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalSold: { $sum: 1 },
                        totalQuantity: { $sum: '$quantity' },
                        totalRevenue: { $sum: '$subtotal' },
                        averageSaleValue: { $avg: '$subtotal' }
                    }
                }
            ]);

            return {
                success: true,
                message: 'Seller sales statistics retrieved successfully',
                data: stats.length > 0 ? stats[0] : {}
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new OrderService();
