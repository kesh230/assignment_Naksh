const jwt = require('jsonwebtoken');
const { User, Cart } = require('../models');

class UserService {
    /**
     * Register a new user and create empty cart
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @param {string} phone
     * @param {string} address
     * @returns {object} { success, message, data }
     */
    async registerUser(username, email, password, phone, address) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return {
                    success: false,
                    message: 'User already exists with this email or username'
                };
            }

            // Create new user (password hashing done in model pre-save hook)
            const user = new User({
                username,
                email,
                password,
                phone,
                address
            });

            await user.save();

            // Create empty cart for user (1:1 relationship)
            const cart = new Cart({
                userId: user._id,
                totalAmount: 0
            });

            await cart.save();

            return {
                success: true,
                message: 'User registered successfully',
                data: {
                    userId: user._id,
                    username: user.username,
                    email: user.email
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
     * Login user and return JWT token
     * @param {string} email
     * @param {string} password
     * @returns {object} { success, message, data }
     */
    async loginUser(email, password) {
        try {
            // Find user and include password field
            const user = await User.findOne({ email }).select('+password');
            
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            // Compare password
            const isPasswordMatch = await user.comparePassword(password);
            if (!isPasswordMatch) {
                return {
                    success: false,
                    message: 'Invalid password'
                };
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '7d' }
            );

            return {
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    userId: user._id,
                    username: user.username,
                    email: user.email
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
     * Get user by ID
     * @param {string} userId
     * @returns {object} { success, message, data }
     */
    async getUserById(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                message: 'User retrieved successfully',
                data: user
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Update user profile
     * @param {string} userId
     * @param {object} updates { username, phone, address }
     * @returns {object} { success, message, data }
     */
    async updateUserProfile(userId, username, phone, address) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    username,
                    phone,
                    address,
                    updatedAt: Date.now()
                },
                { new: true, runValidators: true }
            );

            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                message: 'Profile updated successfully',
                data: user
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Change user password
     * @param {string} userId
     * @param {string} currentPassword
     * @param {string} newPassword
     * @returns {object} { success, message, data }
     */
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await User.findById(userId).select('+password');
            
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            // Verify current password
            const isPasswordMatch = await user.comparePassword(currentPassword);
            if (!isPasswordMatch) {
                return {
                    success: false,
                    message: 'Current password is incorrect'
                };
            }

            // Update password
            user.password = newPassword;
            await user.save();

            return {
                success: true,
                message: 'Password changed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new UserService();
