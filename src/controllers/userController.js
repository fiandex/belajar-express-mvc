const userService = require('../services/userService');
const { user } = require('../utils/prisma');

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.json({
            message: "Berhasil ambil users",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal ambil users",
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = await userService.registerUser(req.body);

        res.status(201).json({
            message: "User berhasil didaftarkan",
            data: newUser
        });
    } catch (error) {
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