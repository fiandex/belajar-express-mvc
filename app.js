const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const path = require('path');
const app = express();
const port = 3000;



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

// A. Format untuk FILE (Polos, tanpa warna, lengkap dengan timestamp)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
  )
);

// B. Format untuk TERMINAL/CONSOLE (Warna-warni)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }), // Ini biang kerok warnanya
  winston.format.timestamp({ format: 'HH:mm:ss' }), // Jam saja cukup biar pendek
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger({
  levels: logLevels.levels,
  // Kita tidak taruh format di sini, tapi di masing-masing transport di bawah
  transports: [
    
    // 1. Tampilkan di Terminal (Pakai format warna)
    new winston.transports.Console({
      format: consoleFormat 
    }),

    // 2. Simpan SEMUA log ke file 'app.log' (Pakai format polos)
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: fileFormat 
    }),

    // 3. Simpan ERROR saja ke file 'error.log' (Biar mudah nyari masalah)
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error', // Hanya level error dan warn yang masuk sini
      format: fileFormat 
    }),
  ],
});

const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

app.use(morgan(':method :url :status - :response-time ms', { stream }));

// Import Routes
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');

app.use(express.json());

// --- ROUTING UTAMA ---
// Artinya: Semua URL yang depannya '/users', serahkan ke userRoutes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Server MVC siap digunakan!');
});

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});