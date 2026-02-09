const { userService } = require('../services');

/**
 * User Controller - Register & Login
 */

// Register user
exports.register = async (req, res) => {
    try {
        const { username, email, password, phone, address } = req.body;

        // Validation
        if (!username || !email || !password || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Call service
        const result = await userService.registerUser(username, email, password, phone, address);

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

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Call service to login user
        const result = await userService.loginUser(email, password);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(401).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
