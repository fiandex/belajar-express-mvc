const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    // 1. Durasi Waktu (Window)
	windowMs: 15 * 60 * 1000, // 15 menit dalam milidetik

    // 2. Batas Maksimal Request per IP
	limit: 50, // Maksimal 100 request per 15 menit
    
    // 3. Konfigurasi Header (Standar baru)
	standardHeaders: true, // Mengirim info limit di header `RateLimit-*`
	legacyHeaders: false, // Mematikan header lama `X-RateLimit-*`

    // 4. Pesan jika limit habis
    message: {
        status: 429,
        message: "Terlalu banyak request dari IP ini, silakan coba lagi setelah 15 menit!"
    }
});

module.exports = limiter;