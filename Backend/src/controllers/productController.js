const { productService } = require('../services');

/**
 * Product Controller - All product operations
 */

// Create product
exports.createProduct = async (req, res) => {
    try {
        const { productName, description, price, quantity, category, imageUrl } = req.body;
        const userId = req.user?.userId || req.body.userId; // From JWT token or body

        // Validation
        if (!productName || !description || !price || !quantity || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, description, price, quantity, and category are required'
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const result = await productService.createProduct(
            userId,
            productName,
            description,
            price,
            quantity,
            category,
            imageUrl || ''
        );

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const result = await productService.getAllProducts(limit, offset);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const result = await productService.getProductById(productId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get products by user
exports.getProductsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const result = await productService.getProductsByUser(userId, limit, offset);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search products
exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const result = await productService.searchProducts(query, limit, offset);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, description, price, quantity, category, imageUrl } = req.body;
        const userId = req.user?.userId || req.body.userId;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const result = await productService.updateProduct(
            productId,
            userId,
            productName,
            description,
            price,
            quantity,
            category,
            imageUrl || ''
        );

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.userId || req.body.userId;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const result = await productService.deleteProduct(productId, userId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get product popularity
exports.getProductPopularity = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const result = await productService.getProductPopularity(productId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Check stock
exports.checkStock = async (req, res) => {
    try {
        const { productId, quantity } = req.query;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and quantity are required'
            });
        }

        const result = await productService.checkStock(productId, parseInt(quantity));

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
