const prisma = require('../utils/prisma');
const { z } = require('zod');

const getAllProducts = async () => {
    const products = await prisma.product.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    nama: true,
                    email: true
                }
            }
        }
    });
    return products;
};


const createProduct = async (productData, userId) => {
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
            image: validationResult.data.image, // Simpan URL gambar

            userId: userId
        }
    });

    return newProduct;
};

const deleteProductById = async (productId, requesterId) => {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });
    if (!product) {
        throw new Error("Produk tidak ditemukan");
    }
    if (product.userId !== requesterId) {
        throw new Error("Anda tidak berhak menghapus produk ini");
    }

    await prisma.product.delete({
        where: { id: productId }
    });


    return;
}

module.exports = {
    getAllProducts,
    createProduct,
    deleteProductById
};