const prisma = require('../utils/prisma');
const { z } = require('zod');
const bcrypt = require('bcrypt');

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};

const registerUser = async (userData) => {
    const userSchema = z.object({
        nama: z.string().min(3, "Nama harus minimal 3 karakter"),
        email: z.string().email("Email tidak valid"),
        password: z.string().min(6, "Password harus minimal 6 karakter")
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

    const hashedPassword = await bcrypt.hash(validationResult.data.password, 10);

    const newUser = await prisma.user.create({
        data: {
            nama: validationResult.data.nama,
            email: validationResult.data.email,
            password: hashedPassword
        }
    });

    const {password, ...userWithoutPassword} = newUser;


    return userWithoutPassword;
};


const deleteUserById = async (userId) => {
    const user = await prisma.user.delete({
        where: { id: userId }
    });
    if (!user) {
        throw new Error("User tidak ditemukan");
    }

    await prisma.user.delete({
        where: { id: userId }
    });
    return user;
}

module.exports = {
    getAllUsers,
    registerUser,
    deleteUserById
};