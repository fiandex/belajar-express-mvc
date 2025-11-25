const express = require('express');
const router = express.Router(); // Pakai Router bawaan Express
const userController = require('../controllers/userController');

// Kalau ada yang akses GET /, panggil fungsi getUsers milik controller
router.get('/', userController.getUsers);

// Kalau ada yang akses POST /, panggil fungsi createUser milik controller
router.post('/', userController.createUser);

module.exports = router;