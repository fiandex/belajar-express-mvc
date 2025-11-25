const productService = require('../services/productService');
const { product } = require('../utils/prisma');

const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json({
            message: "Berhasil ambil produk",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal ambil produk",
            error: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        // 1. Ambil data teks
        const { title, price } = req.body;
        
        // 2. Ambil data file (Kalau user upload)
        // Kita buat URL-nya: /uploads/namafile.jpg
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // 3. Gabungkan jadi satu object untuk dikirim ke Service
        const productData = {
            title,
            price,
            image: imageUrl 
        };

        const newProduct = await productService.createProduct(productData);

        res.status(201).json({
            message: "Produk berhasil dibuat + Gambar!",
            data: newProduct
        });

    } catch (error) {
        res.status(400).json({ message: "Gagal upload produk", error: error.message });
    }
};



module.exports = {
    getProducts,
    createProduct,

};