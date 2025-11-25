const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');


router.post('/file', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
        }

        res.json({
            message: "File berhasil diupload!",
            fileUrl: `/uploads/${req.file.filename}`, 
            fileDetails: req.file
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;