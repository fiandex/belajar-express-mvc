const winston = require('winston');
const path = require('path');

// 1. Definisikan Warna & Level
const logLevels = {
  levels: winston.config.npm.levels,
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  },
};

// Aktifkan warna
winston.addColors(logLevels.colors);

// 2. Format untuk FILE (Polos + Timestamp)
// Digunakan saat di laptop biar log-nya bersih saat dibuka di text editor
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
  )
);

// 3. Format untuk CONSOLE (Warna-warni)
// Digunakan di Terminal Laptop & Logs Dashboard Vercel
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

// ===============================================
// 4. LOGIC PENENTUAN TRANSPORT (PERBAIKAN UTAMA)
// ===============================================

// Secara default, kita selalu ingin log muncul di Console/Terminal
const transports = [
    new winston.transports.Console({ 
        format: consoleFormat 
    })
];

// Kita cek: Apakah kita sedang di Laptop (Development)?
// Jika IYA, maka tambahkan fitur simpan ke File.
// Jika TIDAK (sedang di Vercel/Production), jangan tambahkan ini (biar gak error Read-Only FS).
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.File({ 
            filename: 'logs/combined.log', 
            format: fileFormat 
        })
    );
    transports.push(
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error', 
            format: fileFormat 
        })
    );
}

// 5. Buat Instance Logger
const logger = winston.createLogger({
  levels: logLevels.levels,
  transports: transports, // Gunakan array transports yang sudah dikondisikan di atas
});

// 6. Buat Stream untuk Morgan
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = { logger, stream };