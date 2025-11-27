const productService = require('../services/productService');
const imagekit = require('../utils/imagekit');
const { product } = require('../utils/prisma');


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Mengambil semua data produk
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Halaman ke berapa (Pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       price:
 *                         type: integer
 */
const getAllProducts = async (req, res) => {
    try {
        const result = await productService.getAllProducts(req.query);

        res.json({
            message: "Berhasil ambil produk",
            meta: result.meta,
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal ambil produk",
            error: error.message
        });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const userId = req.user.id; // Dapatkan userId dari token yang sudah di-authenticate
        const result = await productService.getMyProducts(userId, req.query);

        res.json({
            message: "Berhasil ambil produk milik saya",
            meta: result.meta,
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal ambil produk milik saya",
            error: error.message
        })
    }
};

// const getProducts = async (req, res) => {
//     try {
//         const products = await productService.getAllProducts();
//         res.json({
//             message: "Berhasil ambil produk",
//             data: products
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Gagal ambil produk",
//             error: error.message
//         });
//     }
// };

const createProduct = async (req, res) => {
    try {
        const { title, price } = req.body;
        const userId = req.user.id;
        
        let imageUrl = null;

        // --- LOGIKA UPLOAD KE IMAGEKIT ---
        if (req.file) {
            // Kita upload buffer file ke ImageKit
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer, // File dari Memory Storage
                fileName: `product-${Date.now()}-${req.file.originalname}`, // Nama file
                folder: '/toko-online' // (Opsional) Nama folder di ImageKit
            });

            // Ambil URL Permanen dari response ImageKit
            imageUrl = uploadResponse.url;
        }
        // ---------------------------------

        const productData = { title, price, image: imageUrl };

        const newProduct = await productService.createProduct(productData, userId);

        res.status(201).json({
            message: "Produk berhasil dibuat & Upload ke Cloud!",
            data: newProduct
        });

    } catch (error) {
        res.status(400).json({ message: "Gagal upload produk", error: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const requesterId = req.user.id; // Dapatkan userId dari token yang sudah di-authenticate

        await productService.deleteProductById(productId, requesterId);

        res.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        if (error.message === "Produk tidak ditemukan") {
            res.status(404).json({ message: error.message });
        }
        if (error.message === "Anda tidak berhak menghapus produk ini") {
            res.status(403).json({ message: error.message });
        }

        res.status(500).json({ message: "Gagal menghapus produk", error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getMyProducts,
    createProduct,
    deleteProduct
};