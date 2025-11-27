const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/utils/swagger');

const cors = require('cors');
const helmet = require('helmet');

const { logger, stream } = require('./src/utils/logger');


// Import Routes
const rateLimiter = require('./src/middlewares/rateLimiter');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimiter); // Pasang rate limiter di sini

// --- PASANG LOGGER DI SINI ---
// Gunakan format 'combined' atau 'dev', lalu arahkan ke stream winston
app.use(morgan('tiny', { stream })); 
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// --- ROUTING UTAMA ---
// Artinya: Semua URL yang depannya '/users', serahkan ke userRoutes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/upload', uploadRoutes);

// Root route
app.get('/', (req, res) => {
    logger.info("Ada yang akses Home Page"); // Contoh pakai logger manual
    res.send('Server MVC + Logger siap!');
});

// app.listen(port, () => {
//     console.log(`Server jalan di http://localhost:${port}`);
// });

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server jalan di http://localhost:${port}`);
    }
    );
}

module.exports = app;