const request = require('supertest');
const app = require('../app'); // Kita import app, BUKAN server

describe('GET /products', () => {
    
    test('Harus mengembalikan status 200 dan data JSON', async () => {
        // Supertest akan melakukan Request GET ke /products
        const response = await request(app).get('/products');

        // 1. Cek Status Code harus 200 OK
        expect(response.statusCode).toBe(200);

        // 2. Cek tipe konten harus JSON
        expect(response.headers['content-type']).toMatch(/json/);

        // 3. Cek struktur body response kita
        // Ingat format kita: { message: "...", data: [...] }
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        
        // 4. Cek apakah datanya Array
        expect(Array.isArray(response.body.data)).toBe(true);
    });

});