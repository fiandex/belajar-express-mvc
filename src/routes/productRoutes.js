const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', productController.getProducts);
router.post('/', authenticateToken, productController.createProduct);

module.exports = router;