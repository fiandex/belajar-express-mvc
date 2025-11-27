const tambah = (a, b) => {
    return a + b;
};

const kurang = (a, b) => {
    return a - b;
};

// Fungsi cek kelulusan (Contoh logika if-else)
const cekKelulusan = (nilai) => {
    if (nilai >= 75) {
        return "LULUS";
    } else {
        return "TIDAK LULUS";
    }
};

module.exports = { tambah, kurang, cekKelulusan };