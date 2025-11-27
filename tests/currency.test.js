const { formatRupiah } = require('../src/utils/currency');

describe('Unit Test: Format Rupiah', () => {

    test('Harus mengubah angka 10000 menjadi format Rp', () => {
        const hasil = formatRupiah(10000);
        
        // KITA GANTI SPASI AJAIB (\u00a0) JADI SPASI BIASA (' ')
        const hasilNormal = hasil.replace(/\u00a0/g, ' ');
        
        expect(hasilNormal).toBe('Rp 10.000,00'); 
    });

    test('Harus menangani angka 0', () => {
        const hasil = formatRupiah(0);
        const hasilNormal = hasil.replace(/\u00a0/g, ' ');
        
        expect(hasilNormal).toBe('Rp 0,00');
    });

    test('Harus menangani angka kecil (500)', () => {
        const hasil = formatRupiah(500);
        const hasilNormal = hasil.replace(/\u00a0/g, ' ');

        expect(hasilNormal).toBe('Rp 500,00');
    });

    test('Harus menangani angka jutaan', () => {
        const hasil = formatRupiah(1500000);
        const hasilNormal = hasil.replace(/\u00a0/g, ' ');

        expect(hasilNormal).toBe('Rp 1.500.000,00');
    });
});