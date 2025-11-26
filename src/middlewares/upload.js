const multer = require('multer');

// --- PERUBAHAN DI SINI ---
// Kita ganti diskStorage menjadi memoryStorage.
// Artinya file tidak ditulis ke folder, tapi disimpan sementara di memori komputer sebagai 'Buffer'
const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya boleh upload file gambar!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = upload;