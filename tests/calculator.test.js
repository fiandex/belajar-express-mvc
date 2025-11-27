const { tambah, kurang, cekKelulusan } = require('../src/utils/calculator');

// 'describe' digunakan untuk mengelompokkan test
describe('Pengujian Fungsi Kalkulator', () => {

    // Test Case 1
    test('Fungsi tambah harus mengembalikan hasil yang benar', () => {
        const hasil = tambah(5, 5);
        // Kita "Ekspektasi" hasilnya harus 10
        expect(hasil).toBe(10);
    });

    // Test Case 2
    test('Fungsi kurang harus mengembalikan hasil positif jika angka pertama lebih besar', () => {
        expect(kurang(10, 3)).toBe(7);
    });
});

describe('Pengujian Logika Kelulusan', () => {
    
    test('Nilai 80 harus LULUS', () => {
        expect(cekKelulusan(80)).toBe("LULUS");
    });

    test('Nilai 75 harus LULUS (Batas bawah)', () => {
        expect(cekKelulusan(75)).toBe("LULUS");
    });

    test('Nilai 50 harus TIDAK LULUS', () => {
        expect(cekKelulusan(50)).toBe("TIDAK LULUS");
    });
});