const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');

const { logger, stream } = require('./src/utils/logger');


// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');

app.use(express.json());

// --- PASANG LOGGER DI SINI ---
// Gunakan format 'combined' atau 'dev', lalu arahkan ke stream winston
app.use(morgan('tiny', { stream })); 

// --- ROUTING UTAMA ---
// Artinya: Semua URL yang depannya '/users', serahkan ke userRoutes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Root route
app.get('/', (req, res) => {
    logger.info("Ada yang akses Home Page"); // Contoh pakai logger manual
    res.send('Server MVC + Logger siap!');
});

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});