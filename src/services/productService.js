const prisma = require('../utils/prisma');
const { z } = require('zod');

const getAllProducts = async () => {
    const products = await prisma.product.findMany();
    return products;
};


const addProduct = async (productData) => {
    const productSchema = z.object({
        title: z.string().min(3, "Nama produk harus minimal 3 karakter"),
        price: z.number().positive("Harga harus berupa angka positif"),
    });

    const validationResult = productSchema.safeParse(productData);

    if (!validationResult.success) {
        throw new Error(validationResult.error.errors.map(err => err.message).join(", "));
    }

    const newProduct = await prisma.product.create({
        data: validationResult.data
    });

    return newProduct;
};

module.exports = {
    getAllProducts,
    addProduct
};