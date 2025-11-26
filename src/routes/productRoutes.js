const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.get('/', productController.getProducts);
router.post('/', authenticateToken, upload.single('image'),productController.createProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;