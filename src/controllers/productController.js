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
        console.log('User Info:', req.user); // Log user info for debugging
        const newProduct = await productService.addProduct(req.body);
        res.status(201).json({
            message: "Produk berhasil ditambahkan",
            data: newProduct
        });
    } catch (error) {
        res.status(400).json({
            message: "Gagal menambahkan produk",
            error: error.message
        });
    }
};



module.exports = {
    getProducts,
    createProduct,

};