const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2, // Kita set agar selalu ada ,00 di belakang
        maximumFractionDigits: 2
    }).format(angka);
};

module.exports = { formatRupiah };