const prisma = require('../utils/prisma');
const { z } = require('zod');

const getAllProducts = async (params) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        order = 'desc'
    } = params;

    const pageNUm = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNUm - 1) * limitNum;

    const whereClause = {
        title : {
            contains: search,
            mode: 'insensitive'
        }
    };

    if (minPrice) {
        whereClause.price = { ...whereClause.price, gte: parseInt(minPrice) };
    }
    if (maxPrice) {
        whereClause.price = { ...whereClause.price, lte: parseInt(maxPrice) };
    }
    const products = await prisma.product.findMany({
        where: whereClause,
        skip: offset,
        take: limitNum,
        orderBy: {
            [sortBy]: order
        },
        include: {
            user: {
                select: {
                    id: true,
                    nama: true,}
            }
        }
    });

    const totalCount = await prisma.product.count({
        where: whereClause
    });

    return {
        data: products,
        meta: {
            page: pageNUm,
            limit: limitNum,
            totalData: totalCount,
            totalPages: Math.ceil(totalCount / limitNum)
        }
    };
};

const getMyProducts = async (userId, params) => {
    const {
        page = 1, limit = 10, search = '', 
        minPrice, maxPrice, sortBy = 'createdAt', order = 'desc'
    } = params;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {
        userId: userId,
        title: {
            contains: search,
            mode: 'insensitive'
        }
    };

    if (minPrice) {
        whereClause.price = { ...whereClause.price, gte: parseInt(minPrice) };
    }
    if (maxPrice) {
        whereClause.price = { ...whereClause.price, lte: parseInt(maxPrice) };
    }
    const products = await prisma.product.findMany({
        where: whereClause,
        skip: offset,
        take: limitNum,
        orderBy: {
            [sortBy]: order
        }
    });

    const totalCount = await prisma.product.count({
        where: whereClause
    });

    return {
        data: products,
        meta: {
            page: pageNum,
            limit: limitNum,
            totalData: totalCount,
            totalPages: Math.ceil(totalCount / limitNum)
        }
    };
}

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
    getMyProducts,
    createProduct,
    deleteProductById
};