const http = require('http');            // 1. Import module HTTP native
const { Server } = require('socket.io'); // 2. Import Socket.IO
const app = require('./app');            // Import app Express kita
const port = process.env.PORT || 3000;

// 3. Bungkus Express App dengan HTTP Server
const server = http.createServer(app);

// 4. Inisialisasi Socket.io di server tersebut
const io = new Server(server, {
    cors: {
        origin: "*", // Izinkan semua akses (biar gak error CORS saat belajar)
    }
});

// 5. Logic Socket.io (Dunia Realtime)
io.on('connection', (socket) => {
    console.log('⚡ Seorang user terkoneksi! ID:', socket.id);

    // Event: Saat ada user mengirim pesan
    socket.on('kirim-pesan', (data) => {
        console.log(`Pesan dari ${socket.id}: ${data}`);
        
        // Broadcast: Kirim balik pesan ini ke SEMUA orang yang konek
        io.emit('terima-pesan', data);
    });

    // Event: Saat user disconnect (tutup browser)
    socket.on('disconnect', () => {
        console.log('User disconnect:', socket.id);
    });
});

io.on('connection', (socket) => {
    console.log('⚡ User terkoneksi:', socket.id);

    // 1. Event Chatting Biasa (yang sudah ada)
    socket.on('kirim-pesan', (data) => {
        io.emit('terima-pesan', data); // Kirim ke SEMUA (termasuk pengirim)
    });

    // 2. Event Typing Indicator (TUGAS BARU)
    socket.on('sedang-ngetik', () => {
        // Broadcast = Kirim ke SEMUA orang KECUALI pengirimnya sendiri.
        // (Kan aneh kalau kita ngetik, kita sendiri dikasih tahu "Anda sedang ngetik")
        socket.broadcast.emit('info-ngetik', 'Seseorang sedang mengetik...');
    });

    socket.on('disconnect', () => {
        console.log('User disconnect');
    });
});

// 6. GANTI 'app.listen' MENJADI 'server.listen'
// Kalau pakai app.listen, socket.io gak bakal jalan!
server.listen(port, () => {
    console.log(`Server Realtime jalan di http://localhost:${port}`);
});