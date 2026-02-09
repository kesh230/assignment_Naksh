const { Cart, CartItem, Product, User } = require('../models');
const mongoose = require('mongoose');

class CartService {
    /**
     * Get user's cart (1:1 relationship - User has ONE cart)
     * @param {string} userId
     * @returns {object} { success, message, data }
     */
    async getUserCart(userId) {
        try {
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return {
                    success: false,
                    message: 'Cart not found'
                };
            }

            return {
                success: true,
                message: 'Cart retrieved successfully',
                data: cart
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get cart items (1:N relationship - Cart has many Cart_Items)
     * @param {string} userId
     * @returns {object} { success, message, data }
     */
    async getCartItems(userId) {
        try {
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return {
                    success: false,
                    message: 'Cart not found'
                };
            }

            const items = await CartItem.find({ cartId: cart._id })
                .populate({
                    path: 'productId',
                    select: 'name imageUrl category price userId'
                })
                .populate({
                    path: 'productId',
                    populate: {
                        path: 'userId',
                        select: 'username email'
                    }
                })
                .sort({ addedAt: -1 });

            return {
                success: true,
                message: 'Cart items retrieved successfully',
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
     * Add product to cart (1:N relationship - Product in many carts)
     * @param {string} userId
     * @param {string} productId
     * @param {number} quantity
     * @returns {object} { success, message, data }
     */
    async addToCart(userId, productId, quantity) {
        try {
            // Get product details
            const product = await Product.findById(productId);

            if (!product) {
                return {
                    success: false,
                    message: 'Product not found'
                };
            }

            // Check stock
            if (product.quantity < quantity) {
                return {
                    success: false,
                    message: `Insufficient stock. Available: ${product.quantity}`
                };
            }

            // Get user's cart
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                return {
                    success: false,
                    message: 'Cart not found'
                };
            }

            // Check if product already in cart
            const existingItem = await CartItem.findOne({
                cartId: cart._id,
                productId
            });

            if (existingItem) {
                // Update quantity if already exists
                existingItem.quantity += quantity;
                await existingItem.save();
            } else {
                // Create new cart item
                const cartItem = new CartItem({
                    cartId: cart._id,
                    productId,
                    quantity,
                    unitPrice: product.price
                });
                await cartItem.save();
            }

            // Update cart total
            await this.updateCartTotal(cart._id);

            return {
                success: true,
                message: 'Product added to cart'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Update cart item quantity
     * @param {string} userId
     * @param {string} cartItemId
     * @param {number} quantity
     * @returns {object} { success, message }
     */
    async updateCartItem(userId, cartItemId, quantity) {
        try {
            if (quantity <= 0) {
                return {
                    success: false,
                    message: 'Quantity must be greater than 0'
                };
            }

            // Get cart item and verify it belongs to user
            const cartItem = await CartItem.findById(cartItemId);

            if (!cartItem) {
                return {
                    success: false,
                    message: 'Cart item not found'
                };
            }

            const cart = await Cart.findById(cartItem.cartId);

            if (!cart || cart.userId.toString() !== userId) {
                return {
                    success: false,
                    message: 'Unauthorized'
                };
            }

            // Check stock
            const product = await Product.findById(cartItem.productId);

            if (product.quantity < quantity) {
                return {
                    success: false,
                    message: `Insufficient stock. Available: ${product.quantity}`
                };
            }

            // Update quantity
            cartItem.quantity = quantity;
            await cartItem.save();

            // Update cart total
            await this.updateCartTotal(cart._id);

            return {
                success: true,
                message: 'Cart item updated'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Remove item from cart
     * @param {string} userId
     * @param {string} cartItemId
     * @returns {object} { success, message }
     */
    async removeFromCart(userId, cartItemId) {
        try {
            const cartItem = await CartItem.findById(cartItemId);

            if (!cartItem) {
                return {
                    success: false,
                    message: 'Cart item not found'
                };
            }

            const cart = await Cart.findById(cartItem.cartId);

            if (!cart || cart.userId.toString() !== userId) {
                return {
                    success: false,
                    message: 'Unauthorized'
                };
            }

            await CartItem.findByIdAndDelete(cartItemId);

            // Update cart total
            await this.updateCartTotal(cart._id);

            return {
                success: true,
                message: 'Item removed from cart'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Clear entire cart
     * @param {string} userId
     * @returns {object} { success, message }
     */
    async clearCart(userId) {
        try {
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return {
                    success: false,
                    message: 'Cart not found'
                };
            }

            // Delete all cart items
            await CartItem.deleteMany({ cartId: cart._id });

            // Reset cart total
            cart.totalAmount = 0;
            cart.updatedAt = Date.now();
            await cart.save();

            return {
                success: true,
                message: 'Cart cleared'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get cart summary
     * @param {string} userId
     * @returns {object} { success, message, data }
     */
    async getCartSummary(userId) {
        try {
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return {
                    success: false,
                    message: 'Cart not found'
                };
            }

            const items = await CartItem.find({ cartId: cart._id });

            const totalItems = items.length;
            const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

            return {
                success: true,
                message: 'Cart summary retrieved',
                data: {
                    totalItems,
                    totalQuantity,
                    totalAmount
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
     * Update cart total (helper function)
     * @param {string} cartId
     * @returns {void}
     */
    async updateCartTotal(cartId) {
        try {
            const items = await CartItem.find({ cartId });

            const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

            await Cart.findByIdAndUpdate(
                cartId,
                {
                    totalAmount,
                    updatedAt: Date.now()
                }
            );
        } catch (error) {
            console.error('Error updating cart total:', error.message);
        }
    }
}

module.exports = new CartService();
