const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const payload = {
        id: user.id,
        nama: user.nama,
        email: user.email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { 
        user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
        },
        token 
    };
}

module.exports = {
    login,
};