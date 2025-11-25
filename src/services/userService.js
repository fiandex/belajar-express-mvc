const prisma = require('../utils/prisma');
const { z } = require('zod');

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};

const registerUser = async (userData) => {
    const userSchema = z.object({
        nama: z.string().min(3, "Nama harus minimal 3 karakter"),
        email: z.string().email("Email tidak valid"),
    });

    const validationResult = userSchema.safeParse(userData);

    if (!validationResult.success) {

        throw new Error(validationResult.error.errors.map(err => err.message).join(", "));
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: validationResult.data.email }
    });

    if (existingUser) {
        throw new Error("Email sudah terdaftar");
    }

    const newUser = await prisma.user.create({
        data: validationResult.data
    });

    return newUser;
};

module.exports = {
    getAllUsers,
    registerUser
};