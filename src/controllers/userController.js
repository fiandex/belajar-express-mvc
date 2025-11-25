const userService = require('../services/userService');
const { user } = require('../utils/prisma');
const { logger } = require('../utils/logger');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        logger.info("Berhasil ambil daftar users");

        res.json({
            message: "Berhasil ambil users",
            data: users
        });
    } catch (error) {

        logger.error(`Gagal ambil daftar users: ${error.message}`);

        res.status(500).json({
            message: "Gagal ambil users",
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = await userService.registerUser(req.body);

        logger.info(`User baru terdaftar: ${newUser.id}`);

        res.status(201).json({
            message: "User berhasil didaftarkan",
            data: newUser
        });
    } catch (error) {

        logger.error(`Gagal mendaftarkan user: ${error.message}`);
        res.status(400).json({
            message: "Gagal mendaftarkan user",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    createUser
};