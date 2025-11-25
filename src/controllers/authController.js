const authService = require('../services/authService');
const {logger} = require('../utils/logger');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.warn('Login attempt with missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const result = await authService.login(email, password);

        logger.info(`User logged in: ${email}`);
        
        res.json({
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = {
    login,
};