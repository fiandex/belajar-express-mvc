const prisma = require('../utils/prisma');
const { z } = require('zod');

const getAllProducts = async () => {
    const products = await prisma.product.findMany();
    return products;
};


const createProduct = async (productData) => {
    // 1. Update Validasi Zod
    const productSchema = z.object({
        title: z.string().min(3),
        // z.coerce.number() akan memaksa string "1000" jadi angka 1000
        price: z.coerce.number().min(1000), 
        image: z.string().optional() // Image boleh ada boleh tidak
    });

    const validationResult = productSchema.safeParse(productData);

    if (!validationResult.success) {
        throw new Error(validationResult.error.errors.map(err => err.message).join(", "));
    }

    // 2. Simpan ke Database
    const newProduct = await prisma.product.create({
        data: {
            title: validationResult.data.title,
            price: validationResult.data.price,
            image: validationResult.data.image // Simpan URL gambar
        }
    });

    return newProduct;
};
module.exports = {
    getAllProducts,
    createProduct
};