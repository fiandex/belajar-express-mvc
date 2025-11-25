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

winston.addColors(logLevels.colors);

// 2. Format untuk FILE (Polos + Timestamp)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
  )
);

// 3. Format untuk CONSOLE (Warna-warni)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

// 4. Bikin Instance Logger
const logger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    // Tampil di Terminal
    new winston.transports.Console({ 
        format: consoleFormat 
    }),
    // Simpan ke File Combined
    new winston.transports.File({ 
        filename: 'logs/combined.log', 
        format: fileFormat 
    }),
    // Simpan ke File Error
    new winston.transports.File({ 
        filename: 'logs/error.log', 
        level: 'error', 
        format: fileFormat 
    }),
  ],
});

// 5. Bikin Stream untuk Morgan (Agar Morgan kirim log ke Winston)
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Export logger dan stream biar bisa dipake di file lain
module.exports = { logger, stream };