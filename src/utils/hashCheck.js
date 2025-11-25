const bcrypt = require('bcrypt');

const cekPassword = async (passwordInput, passwordDatabase) => {
    // Gunakan bcrypt.compare(input, hash)
    // Ini akan mengembalikan true/false
    const match = await bcrypt.compare(passwordInput, passwordDatabase);
    console.log(`Apakah password cocok? ${match}`);
};

// Copy hash dari Prisma Studio tadi, paste di sini
const hashDariDb = '$2b$10$7OQNkJBp1SR86FAYxaqxruRjdDueLZG6RytqJ46Z0Tr8Tw8WKOHm.'; 

cekPassword('rahasia12345', hashDariDb); // Harusnya True
cekPassword('salah123', hashDariDb);     // Harusnya False